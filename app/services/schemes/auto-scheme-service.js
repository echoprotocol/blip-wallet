import CryptoService from '../crypto-service';

class PrivateStorage {

	/**
	 *
	 * @param {String} protectedPrivateKey
	 * @param {String} protectedIV
	 * @param {String} encryptedEncryptionHash
	 */
	constructor(protectedPrivateKey, protectedIV, encryptedEncryptionHash) {
		this.protectedPrivateKey = protectedPrivateKey;
		this.protectedIV = protectedIV;
		this.encryptedEncryptionHash = encryptedEncryptionHash;
	}

}

let privateStorage;

class AutoSchemeService {

	/**
	 *
	 * @param {StorageService} storageService
	 */
	constructor(storageService) {
		this.storageService = storageService;
	}

	/**
	 *
	 * @param db
	 * @return {Promise.<void>}
	 */
	async updateDB(db) {
		const encHash = this.getEncHash();
		await this.storageService.updateDBByEncryptionHash(db, encHash);
	}

	getEncHash() {
		if (!privateStorage) {
			throw new Error('Private storage doesn\'t set');
		}

		const decrypted = CryptoService.decryptData(privateStorage.protectedPrivateKey, privateStorage.encryptedEncryptionHash, { IV: privateStorage.protectedIV });

		return decrypted.toString('hex');
	}

	/**
	 *
	 * @return {Promise.<*>}
	 */
	async getDecryptedData() {

		const encHash = this.getEncHash();

		const decryptedData = await this.storageService.decryptDBByEncryptionHash(encHash);

		return JSON.parse(decryptedData.toString('utf8'));
	}

	/**
	 *
	 * @param {String} password
	 * @return {Promise.<void>}
	 */
	async setEncryptionHash(password) {

		if (privateStorage) {
			throw new Error('PrivateStorage is enabled. Please reset it');
		}

		const encHash = await this.storageService.getEncHash(password);

		const protectedPrivateKey = CryptoService.randomBytes(32).toString('hex');
		const protectedIV = CryptoService.randomBytes(16).toString('hex');
		const encryptedEncryptionHash = CryptoService.encryptData(protectedPrivateKey, Buffer.from(encHash, 'hex'), { IV: protectedIV });

		privateStorage = new PrivateStorage(protectedPrivateKey, protectedIV, encryptedEncryptionHash);

	}

	resetPrivateStorage() {
		privateStorage = null;
	}

}

export default AutoSchemeService;
