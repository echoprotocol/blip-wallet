import Blockchain from './blockchain';
import Crypto from './crypto';

class Services {

	constructor() {
		this.blockchain = null;
		this.crypto = null;
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

		this.crypto = new Crypto();

		return this.crypto;
	}

}

export default new Services();
