import Blockchain from './blockchain';
import UserStorageService from './user-storage-service';
import Emitter from './emitter';
import LocalStrorageService from './localstorage-service';

class Services {

	constructor() {
		this.blockchain = null;
		this.crypto = null;
		this.userStorageService = null;
		this.emitter = null;
		this.localStorage = null;
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

	getLocalStorage() {
		if (this.localStorage) {
			return this.localStorage;
		}

		this.localStorage = new LocalStrorageService();

		return this.localStorage;
	}

}

export default new Services();
