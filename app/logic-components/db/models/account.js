import { validators } from 'echojs-lib';

class Account {

	/**
	 *
	 * @param {String} id
	 * @param {String} name
	 * @param {Boolean} selected
	 */
	constructor(id, name, selected) {
		this.id = id;
		this.name = name;
		this.selected = selected;
	}

	/**
	 *
	 * @param {String} id
	 * @param {String} name
	 * @param {Boolean} selected
	 * @return {Account}
	 */
	static create(id, name, selected = true) {

		if (!validators.isAccountId(id)) {
			throw new Error('Account id is required.');
		}

		if (!name) {
			throw new Error('Account name is required.');
		}

		if (typeof selected !== 'boolean') {
			throw new Error('Selected must be a boolean.');
		}

		return new Account(id, name, selected);
	}

}

export default Account;
