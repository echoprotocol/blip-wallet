/* eslint-disable no-underscore-dangle */
import { Echo, constants } from 'echojs-lib';
import {
	NETWORKS,
	CONNECTION_TIMEOUT,
	MAX_RETRIES,
	PING_INTERVAL,
	PING_TIMEOUT,
	DISCONNECT_STATUS,
	REMOTE_NODE,
	LOCAL_NODE,
	CONNECT_STATUS,
} from '../constants/global-constants';
import { DIFF_TIME_SYNC_MS, SYNC_MONITOR_MS, RESTART_TIME_CHECKING_NODE_MS } from '../constants/chain-constants';

let ipcRenderer;

try {
	/* eslint-disable global-require */
	const electron = require('electron');
	({ ipcRenderer } = electron);
} catch (e) {
	console.log('Err electron import');
}

class Blockchain {

	/**
	 *  @constructor
	 *
	 *  Init nodes, api, store
	 */
	constructor(emitter) {
		this.current = '';
		this.network = '';
		this.remote = null;
		this.local = null;
		this.api = null;
		this.emitter = emitter;
		this.isOnline = window.navigator.onLine;
		this.timeOffset = null;
		this.isRemoteConnected = false;
		this.isLocalConnected = false;
		this.localNodeUrl = false;
		this.remoteInited = false;
		this.store = null;
		this.localNodePercent = 0;
		this.localNodeDiffSyncTime = 10e9;
	}

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get isConnected() {

		if (!this.isOnline) {
			return false;
		}

		if (this.current === REMOTE_NODE) {
			return this.isRemoteConnected;
		}

		if (this.current === LOCAL_NODE) {
			return this.isLocalConnected;
		}

		return false;

	}

	async checkSwitching() {

		if ((this.localNodeDiffSyncTime >= 0 && this.localNodeDiffSyncTime <= DIFF_TIME_SYNC_MS && this.isLocalConnected) || (this.isLocalConnected && !this.isRemoteConnected)) {

			if (this.isLocalConnected) {
				await this.switchToLocal();
			}

		} else if (this.isRemoteConnected) {
			await this.switchToRemote();
		}

		console.info(`[BLOCKCHAIN] Check switching. Current: ${this.current}. Connected ${this.isConnected}`);
	}


	updateOnlineStatus(status) {

		console.info('INTERNET CONNECTION STATUS', status.type);

		this.isOnline = status.type === 'online';

		if (this.isOnline) {

			if (!this.remote) {
				this.startCheckingRemote();
			}

			if (!this.local) {
				this.startCheckingLocalNode();
			}

		} else {
			this.emitter.emit('setIsConnected', this.isConnected);
		}

		this.notifyLocalNodePercent();

	}

	/**
	 *
	 * @param network
	 * @param store
	 * @returns {Promise<void>}
	 */
	async init(network, store) {

		this.store = store;

		window.addEventListener('online', this.updateOnlineStatus.bind(this));
		window.addEventListener('offline', this.updateOnlineStatus.bind(this));


		if (this.remote || this.local) {
			throw new Error('Instance already initialized');
		}

		try {

			this.setNetworkGroup(network);

			if (ipcRenderer) {

				ipcRenderer.on('port', (_, port) => {

					this.localNodeUrl = `ws://127.0.0.1:${port}`;

					if (this.isOnline) {
						this.startCheckingLocalNode();
					}

				});

				ipcRenderer.send('subscribePort');
			}

			this.startCheckingRemote();


		} catch (e) {
			console.error('init error', e);
		}

		this.emitter.emit('setIsConnected', this.isConnected);
	}

	async checkNodeSync() {


		try {

			const timeOffset = await this.getTimeOffset();
			const localGlobalObject = await this.local.api.getObject('2.1.0');
			let found = false;
			let blockNum = 1;

			while (!found && localGlobalObject.head_block_number >= blockNum) {
				/* eslint-disable no-await-in-loop */
				const block = await this.local.api.getBlock(blockNum);

				if (!block) {
					return false;
				}

				if (!block || (block && block.timestamp === '1970-01-01T00:00:00')) {
					blockNum += 1;
				} else {
					found = true;
				}

			}

			const firstBlock = await this.local.api.getBlock(blockNum);


			if (!firstBlock) {
				return false;
			}

			const firstBlockTime = new Date(`${firstBlock.timestamp}Z`).getTime();
			const chainTime = new Date(`${localGlobalObject.time}Z`).getTime();
			const now = Date.now() + timeOffset;
			const percent = (chainTime - firstBlockTime) / (now - firstBlockTime) * 100;

			console.info(`[BLOCKCHAIN] Percent: ${percent}%. Diff time: ${now - chainTime}. Height: ${localGlobalObject.head_block_number}`);

			this.localNodeDiffSyncTime = now - chainTime;
			this.localNodePercent = percent;

			this.notifyLocalNodePercent();

			this.checkSwitching();
		} catch (e) {
			console.warn('checkNodeSync error', e);
		}

		return true;
	}

	notifyLocalNodePercent() {
		this.emitter.emit('setLocalNodePercent', this.isOnline && this.isLocalConnected && this.localNodeDiffSyncTime >= 0 && this.localNodeDiffSyncTime < DIFF_TIME_SYNC_MS ? 100 : Math.floor(this.localNodePercent * 100) / 100);
	}

	switchToLocal() {

		if (!this.local || this.current === LOCAL_NODE) {
			return false;
		}

		if (this.switching) {
			return console.warn('[NODES] SWITCHING to local');
		}

		this.switching = true;
		this._copyCacheToLocal();

		if (this.remote) {
			this.remote.cache.removeRedux();
		}

		this.local.cache.redux.store = this.store.store ? this.store.store : this.store;

		this.current = LOCAL_NODE;
		this.emitter.emit('setCurrentNode', LOCAL_NODE);
		this.switching = false;
		this.local.subscriber._subscribeCache();

		this._overrideApi(this.local);

		console.info(`[BLOCKCHAIN] SET CURRENT NODE: ${LOCAL_NODE}`);

		return true;
	}

	switchToRemote() {

		if (!this.remote || this.current === REMOTE_NODE) {
			return false;
		}

		if (this.switching) {
			return console.log('[NODES] SWITCHING to remote');
		}

		this.switching = true;

		this._copyCacheToRemote();

		if (this.local) {
			this.local.cache.removeRedux();
		}

		this.remote.cache.redux.store = this.store.store ? this.store.store : this.store;

		this.current = REMOTE_NODE;
		this.emitter.emit('setCurrentNode', REMOTE_NODE);
		this.remote.subscriber._subscribeCache();
		this.switching = false;

		this._overrideApi(this.remote);

		console.info(`[BLOCKCHAIN] SET CURRENT NODE: ${REMOTE_NODE}`);

		return true;
	}

	_overrideApi(node) {
		this.api = node.api;
		this.api.createTransaction = node.createTransaction.bind(node);
	}

	async startCheckingRemote() {

		if (!this.isOnline) {
			console.info('[REMOTE NODE] Offline');
			return false;
		}

		if (this.remoteInited) {
			console.info('[REMOTE NODE] inited');
			return false;
		}

		if (this.remoteConnecting) {
			console.info('[REMOTE NODE] connecting');
			return false;
		}

		this.remoteConnecting = true;

		try {

			await this._remoteStart();

		} catch (e) {
			console.warn('[REMOTE NODE] Error ', e);
			setTimeout(() => {
				this.startCheckingRemote();
			}, RESTART_TIME_CHECKING_NODE_MS);
		}

		this.remoteConnecting = false;

		return true;
	}

	async getTimeOffset() {
		return new Promise((resolve, reject) => {

			if (this.timeOffset) {
				return resolve(this.timeOffset);
			}

			ipcRenderer.once('getTimeOffset', (event, arg) => {
				if (arg.result) {
					if (!this.timeOffset) {
						this.timeOffset = arg.result;
					}
					return resolve(this.timeOffset);
				}

				return reject(arg.error);

			});

			ipcRenderer.send('getTimeOffset', 'ping');

			return true;
		});
	}

	startSyncMonitor() {
		setInterval(async () => {
			this.checkNodeSync();
		}, SYNC_MONITOR_MS);
	}

	async startCheckingLocalNode() {

		if (!this.isOnline) {
			console.log('[LOCAL NODE] Offline');
			return false;
		}

		if (!this.localNodeUrl) {
			return console.log('[LOCAL NODE] URL is empty');
		}

		if (this.localConnecting) {
			console.log('[LOCAL NODE] connecting');
			return false;
		}

		this.localConnecting = true;

		const url = this.localNodeUrl;

		try {

			await this._localStart();

			this.startSyncMonitor();

		} catch (e) {

			console.warn(e);

			setTimeout(() => {
				this.startCheckingLocalNode(url);
			}, RESTART_TIME_CHECKING_NODE_MS);
		}

		this.localConnecting = false;

		return true;
	}

	setNetworkGroup(network) {
		this.network = network;
	}

	async _createConnection(url) {

		const instance = new Echo();

		await instance.connect(url, {
			connectionTimeout: CONNECTION_TIMEOUT,
			maxRetries: MAX_RETRIES,
			pingTimeout: PING_TIMEOUT,
			pingInterval: PING_INTERVAL,
			debug: false,
			apis: [
				'database',
				'network_broadcast',
				'history',
				'registration',
				// 'asset',
				'login',
				// 'network_node',
			],
		});

		return instance;
	}

	async _localStart() {

		this.local = await this._createConnection(this.localNodeUrl);

		console.info('[LOCAL NODE] Connected');

		// this.local.cache.setStore(this.store);

		this.local.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => {
			this.isLocalConnected = false;
			this.checkSwitching();
		});

		this.local.subscriber.setStatusSubscribe(CONNECT_STATUS, () => {
			this.isLocalConnected = true;
			this.checkSwitching();
		});

		this.isLocalConnected = true;

		this.checkSwitching();
	}

	async _remoteStart() {

		this.remote = await this._createConnection(NETWORKS[this.network][REMOTE_NODE].url, { pingInterval: PING_INTERVAL, pingTimeout: PING_TIMEOUT });

		this.remote.cache.setStore(this.store);

		console.info('[REMOTE NODE] Connected');

		this.current = REMOTE_NODE;
		this._overrideApi(this.remote);

		this.remote.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => {
			this.isRemoteConnected = false;
			this.checkSwitching();
		});

		this.remote.subscriber.setStatusSubscribe(CONNECT_STATUS, () => {
			this.isRemoteConnected = true;
			this.checkSwitching();
		});
		this.isRemoteConnected = true;
		this.checkSwitching();

	}

	_copyCacheToLocal() {

		if (!this.remote || !this.remote.cache) {
			return null;
		}

		const cacheRemote = this.remote.cache;

		Object.values(constants.CACHE_MAPS).forEach((key) => {
			const value = cacheRemote[key];
			if (this.local.cache[key] && this.local.cache[key].equals) {
				if (!this.local.cache[key].equals(value)) {
					this.local.cache[key] = value;
				}
			} else if (this.local.cache[key] !== value) {
				this.local.cache[key] = value;
			}
		});

		return null;
	}

	_copyCacheToRemote() {

		if (!this.local || !this.local.cache) {
			return null;
		}

		const cacheLocal = this.local.cache;
		Object.values(constants.CACHE_MAPS).forEach((key) => {

			const value = cacheLocal[key];

			if (this.remote.cache[key] && this.remote.cache[key].equals) {
				if (!this.remote.cache[key].equals(value)) {
					this.remote.cache[key] = value;
				}
			} else if (this.remote.cache[key] !== value) {
				this.remote.cache[key] = value;
			}
		});

		return null;
	}

	/**
	 *
	 * @param {Array} accounts
	 * @return {boolean}
	 */
	setAccounts(accounts = []) {

		if (!ipcRenderer) {
			return false;
		}

		ipcRenderer.send('startNode', { accounts });

		return true;
	}

}

export default Blockchain;
