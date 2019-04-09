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

	constructor() {
		this.current = '';
		this.remote = null;
		this.local = null;
		this.api = null;
		this.store = null;
		this.isConnectedCb = null;
	}

	get isConnected() {
		if (!this.remote || !this.local) {
			return 'Not initialized';
		}

		return this.remote.isConnected || this.local.isConnected;
	}

	async init(store, isConnectedCb) {

		if (this.remote || this.local) {
			throw new Error('Instance already initialized');
		}

		try {
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

		this.isConnectedCb = isConnectedCb;
		this.isConnectedCb(this.isConnected);
	}

	async localConnect() {
		await this._createConnection(this.local, LOCAL_NODE);

		this._copyCacheToLocal();

		this.remote.cache.removeRedux();

		this.local.cache.redux.store = this.store;

		this.api = this.local.api;

		this.remote.disconnect();
	}

	async remoteConnect() {
		await this._createConnection(this.remote, REMOTE_NODE);

		this._copyCacheToRemote();

		this.local.cache.removeRedux();

		this.remote.cache.redux.store = this.store;

		this.api = this.remote.api;

		this.local.disconnect();
	}

	async _createConnection(instance, node) {

		this.current = node;

		try {
			await instance.connect(NETWORKS[node].url, {
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

		this.api = this.local.api;

		this.local.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => this._localDisconnectCb());
		this.local.subscriber.setStatusSubscribe(CONNECT_STATUS, () => this.isConnectedCb(this.isConnected));

		this.local.cache.setStore(store);
	}

	async _remoteStart(store) {
		await this._createConnection(this.remote, REMOTE_NODE);

		this.api = this.remote.api;

		this.remote.subscriber.setStatusSubscribe(DISCONNECT_STATUS, () => this._remoteDisconnectCb());
		this.remote.subscriber.setStatusSubscribe(CONNECT_STATUS, () => this.isConnectedCb(this.isConnected));

		this.remote.cache.setStore(store);
	}

	async _remoteDisconnectCb() {
		if (this.current === LOCAL_NODE) {
			return false;
		}

		await this._createConnection(this.local, LOCAL_NODE);

		this.isConnectedCb(this.isConnected);

		this._copyCacheToLocal();

		this.remote.cache.removeRedux();

		this.api = this.local.api;

		return true;
	}

	async _localDisconnectCb() {
		if (this.current === REMOTE_NODE) {
			return false;
		}

		await this._createConnection(this.remote);

		this.isConnectedCb(this.isConnected);

		this._copyCacheToRemote();

		this.local.cache.removeRedux();

		this.api = this.remote.api;

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
