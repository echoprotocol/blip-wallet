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

import LocalNode from './localNode';

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
		this.store = null;
		this.emitter = emitter;
	}

	/**
	 * @readonly
	 * @type {boolean}
	 */
	get isConnected() {
		if (!this.remote || !this.local) {
			return 'Not initialized';
		}

		return this.remote.isConnected || this.local.isConnected;
	}

	/**
	 *
	 * @param network
	 * @param store
	 * @returns {Promise<void>}
	 */
	async init(network, store) {

		if (this.remote || this.local) {
			throw new Error('Instance already initialized');
		}

		try {
			this.setNetworkGroup(network);

			this.remote = new Echo();
			this.local = new Echo();

			if (LocalNode.isSynced()) {
				await this._localStart(store);
			} else {
				await this._remoteStart(store);
			}
		} catch (e) {
			if (this.current === LOCAL_NODE) {
				await this._remoteStart(store);
			}
		}

		this.emitter.emit('setIsConnected', this.isConnected);
	}

	async localConnect() {
		await this._createConnection(this.local, LOCAL_NODE);

		this._copyCacheToLocal();

		this.remote.cache.removeRedux();

		this.local.cache.redux.store = this.store;

		this._overrideApi(this.local);

		this.remote.disconnect();
	}

	async remoteConnect() {
		await this._createConnection(this.remote, REMOTE_NODE);

		this._copyCacheToRemote();

		this.local.cache.removeRedux();

		this.remote.cache.redux.store = this.store;

		this._overrideApi(this.remote);

		this.local.disconnect();
	}

	setNetworkGroup(network) {
		this.network = network;
	}

	_overrideApi(node) {
		this.api = node.api;
		this.api.createTransaction = node.createTransaction.bind(node);
	}

	async _createConnection(instance, node) {

		this.current = node;
		this.emitter.emit('setCurrentNode', node);

		try {
			await instance.connect(NETWORKS[this.network][node].url, {
				connectionTimeout: CONNECTION_TIMEOUT,
				maxRetries: MAX_RETRIES,
				pingTimeout: PING_TIMEOUT,
				pingInterval: PING_INTERVAL,
				debug: false,
				apis: constants.WS_CONSTANTS.CHAIN_APIS,
			});
		} catch (err) {
			console.warn(err.message);
		}

	}

	async _localStart(store) {
		await this._createConnection(this.local, LOCAL_NODE);

		this._overrideApi(this.local);

		this.local.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => this._localDisconnectCb());
		this.local.subscriber.setStatusSubscribe(CONNECT_STATUS, () => this.emitter.emit('setIsConnected', this.isConnected));

		this.local.cache.setStore(store);
	}

	async _remoteStart(store) {
		await this._createConnection(this.remote, REMOTE_NODE);

		this._overrideApi(this.remote);

		this.remote.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => this._remoteDisconnectCb());
		this.remote.subscriber.setStatusSubscribe(CONNECT_STATUS, () => this.emitter.emit('setIsConnected', this.isConnected));

		this.remote.cache.setStore(store);
	}

	async _remoteDisconnectCb() {
		if (this.current === LOCAL_NODE) {
			return false;
		}

		await this._createConnection(this.local, LOCAL_NODE);

		this.emitter.emit('setIsConnected', this.isConnected);

		this._copyCacheToLocal();

		this.remote.cache.removeRedux();

		this._overrideApi(this.local);

		return true;
	}

	async _localDisconnectCb() {
		if (this.current === REMOTE_NODE) {
			return false;
		}

		await this._createConnection(this.remote);

		this.emitter.emit('setIsConnected', this.isConnected);

		this._copyCacheToRemote();

		this.local.cache.removeRedux();

		this._overrideApi(this.remote);

		return true;
	}

	_copyCacheToLocal() {
		if (!this.remote.cache) {
			return null;
		}

		const cacheRemote = this.remote.cache;

		Object.entries(cacheRemote).forEach(([key, value]) => {
			if (this.local.cache[key] && this.local.cache[key].equals) {
				if (!this.local.cache[key].equals(value)) {
					this.local.cache[key] = value;
				}
			} else if (this.local.cache[key] !== value) {
				if (key === 'redux') {
					this.store = value.store;
				} else {
					this.local.cache[key] = value;
				}
			}
		});

		return null;
	}

	_copyCacheToRemote() {
		if (!this.local.cache) {
			return null;
		}

		const cacheLocal = this.local.cache;

		Object.entries(cacheLocal).forEach(([key, value]) => {
			if (this.remote.cache[key] && this.remote.cache[key].equals) {
				if (!this.remote.cache[key].equals(value)) {
					this.remote.cache[key] = value;
				}
			} else if (this.remote.cache[key] !== value) {
				if (key === 'redux') {
					this.store = value.store;
				} else {
					this.remote.cache[key] = value;
				}
			}
		});

		return null;
	}

}

export default Blockchain;
