import Blockchain from './blockchain';
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
