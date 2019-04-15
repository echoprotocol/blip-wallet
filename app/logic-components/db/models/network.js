
class Network {

	/**
	 *
	 * @param {Array} accounts
	 * @param {Array} keys
	 */
	constructor(accounts, keys) {
		this.accounts = accounts;
		this.keys = keys;
	}

	/**
	 *
	 * @param {Array} accounts
	 * @param {Array} keys
	 */
	static create(accounts, keys) {
		return new Network(accounts, keys);
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

}

export default Network;
