
class Network {

	/**
	 *
	 * @param {Array} accounts
	 * @param {Array} keys
	 * @param {Object} chainToken
	 */
	constructor(accounts, keys, chainToken = null) {
		this.accounts = accounts;
		this.keys = keys;
		this.chainToken = chainToken;
	}

	/**
	 *
	 * @param {Array} accounts
	 * @param {Array} keys
	 * @param {Object} chainToken
	 */
	static create(accounts, keys, chainToken = null) {
		return new Network(accounts, keys, chainToken);
	}

	/**
	 *
	 * @param {Account} account
	 * @returns {Network}
	 */
	addAccount(account) {
		this.accounts.push(account);
		return this;
	}

	/**
	 *
	 * @param {Account} accounts
	 * @returns {Network}
	 */
	updateAccounts(accounts) {
		this.accounts = accounts;
		return this;
	}

	/**
	 *
	 * @param {Key} key
	 * @returns {Network}
	 */
	addKey(key) {
		this.keys.push(key);
		return this;
	}

	/**
	 *
	 * @param {Key} keys
	 * @returns {Network}
	 */
	updateKeys(keys) {
		this.keys = keys;
		return this;
	}

	/**
	 *
	 * @return {Array}
	 */
	getAllAccounts() {
		return this.accounts;
	}

	/**
	 *
	 * @return {Array}
	 */
	getAllKeys() {
		return this.keys;
	}

	getChainToken() {
		return this.chainToken;
	}

}

export default Network;
