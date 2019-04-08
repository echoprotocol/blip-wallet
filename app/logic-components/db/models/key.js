import { validators } from 'echojs-lib';

class Key {

	/**
	 *
	 * @param {String} publicKey
	 * @param {String} wif
	 * @param {String} accountId
	 */
	constructor(publicKey, wif, accountId) {
		this.publicKey = publicKey;
		this.wif = wif;
		this.accountId = accountId;
	}

	/**
	 *
	 * @param {String} publicKey
	 * @param {String} wif
	 * @param {String} accountId
	 * @return {Account}
	 */
	static create(publicKey, wif, accountId) {

		if (!publicKey) {
			throw new Error('publicKey is required.');
		}

		if (!wif) {
			throw new Error('WIF is required.');
		}

		if (!validators.isAccountId(accountId)) {
			throw new Error('Account id is required.');
		}

		return new Key(publicKey, wif, accountId);

	}

}

export default Key;
