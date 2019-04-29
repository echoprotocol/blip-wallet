import Services from '../services';

/**
 * @method getKeysByAccountId
 * @param {Object} account
 */
export const getKeysByAccountId = (account) => async () => {

	const userStorage = Services.getUserStorage();

	const publicKeys = account.getIn(['active', 'key_auths']).map((key) => key.get(0)).toArray();

	if (!publicKeys.length) {
		return [];
	}

	const keys = await userStorage.getAllWIFKeysForAccount(account.get('id'));

	return keys.filter((key) => publicKeys.indexOf(key.publicKey) !== -1);

};
