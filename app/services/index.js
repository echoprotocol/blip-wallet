import Blockchain from './blockchain';
import CryptoService from './crypto-service';
import UserStorageService from './user-storage-service';

class Services {

	constructor() {
		this.blockchain = null;
		this.crypto = null;
		this.userStorageService = null;
	}

	getEcho() {
		if (this.blockchain) {
			return this.blockchain;
		}

		this.blockchain = new Blockchain();

		return this.blockchain;
	}

	getCrypto() {

		if (this.crypto) {
			return this.crypto;
		}

		this.crypto = new CryptoService();

		return this.crypto;
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

}

export default new Services();
