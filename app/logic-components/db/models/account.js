import { validators } from 'echojs-lib';

class Account {

	/**
	 *
	 * @param {String} id
	 * @param {String} name
	 */
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	/**
	 *
	 * @param {String} id
	 * @param {String} name
	 * @return {Account}
	 */
	static create(id, name) {

		if (!validators.isAccountId(id)) {
			throw new Error('Account id is required.');
		}

		if (!name) {
			throw new Error('Account name is required.');
		}

		return new Account(id, name);
	}

}

export default Account;
