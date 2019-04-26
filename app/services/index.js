import Blockchain from './blockchain';
import UserStorageService from './user-storage-service';
import Emitter from './emitter';
import Graphql from './graphql';
import LocalStrorageService from './localstorage-service';
import TokenSubscribe from './token-subscribe';

class Services {

	constructor() {
		this.blockchain = null;
		this.crypto = null;
		this.userStorageService = null;
		this.emitter = null;
		this.graphql = null;
		this.localStorage = null;
		this.tokenSubscribe = null;
	}

	getEcho() {
		if (this.blockchain) {
			return this.blockchain;
		}

		this.blockchain = new Blockchain(this.getEmitter());

		return this.blockchain;
	}

	/**
	 *
	 * @return {UserStorageService}
	 */
	getUserStorage() {

		if (this.userStorageService) {
			return this.userStorageService;
		}

		this.userStorageService = new UserStorageService();

		return this.userStorageService;
	}

	getEmitter() {

		if (this.emitter) {
			return this.emitter;
		}

		this.emitter = new Emitter();

		return this.emitter;
	}

	getGraphql() {

		if (this.graphql) {
			return this.graphql;
		}

		this.graphql = Graphql;

		return this.graphql;
	}

	getLocalStorage() {
		if (this.localStorage) {
			return this.localStorage;
		}

		this.localStorage = new LocalStrorageService();

		return this.localStorage;
	}

	getTokenSubscribe() {
		if (this.tokenSubscribe) {
			return this.tokenSubscribe;
		}

		this.tokenSubscribe = new TokenSubscribe(this.getEmitter(), this.getGraphql());

		return this.tokenSubscribe;
	}

}

export default new Services();
