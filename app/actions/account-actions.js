import { PrivateKey } from 'echojs-lib';

import Services from '../services';
import CryptoService from '../services/crypto-service';
import { FORM_SIGN_UP } from '../constants/form-constants';
import { setFormError, toggleLoading } from './form-actions';
import ValidateAccountHelper from '../helpers/validate-account-helper';
import GlobalReducer from '../reducers/global-reducer';

import Account from '../logic-components/db/models/account';
import Key from '../logic-components/db/models/key';
import { setValue } from './global-actions';

/**
 * @method validateAccount
 *
 * Validate account name and lookup
 *
 * @param form
 * @param accountName
 */
export const validateAccount = (form, accountName) => async (dispatch) => {
	const error = ValidateAccountHelper.validateAccountName(accountName);

	if (error) {
		dispatch(setFormError(FORM_SIGN_UP, 'accountName', error));
		dispatch(toggleLoading(form, false));

		return false;
	}

	if (!Services.getEcho().isConnected) {
		dispatch(setFormError(FORM_SIGN_UP, 'accountName', 'Connection error'));
		dispatch(toggleLoading(form, false));

		return false;
	}

	try {
		const result = await Services.getEcho().api.lookupAccounts(accountName);

		if (result.find((i) => i[0] === accountName)) {
			dispatch(setFormError(FORM_SIGN_UP, 'accountName', 'Account already exist'));
		}
	} catch (err) {

		dispatch(setFormError(FORM_SIGN_UP, 'accountName', 'Account already exist'));

		console.warn(err.message || err);
	} finally {
		dispatch(toggleLoading(form, false));
	}

	return true;
};

const addAccount = (id, name) => (dispatch, getState) => {
	let accounts = getState().global.get('accounts');

	accounts = accounts.set(id, name);

	dispatch(setValue('accounts', accounts));
};

/**
 * @method registerAccount
 *
 * Account registration
 */
export const registerAccount = () => async (dispatch, getState) => {

	const accountName = getState().form.getIn([FORM_SIGN_UP, 'accountName']);

	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'account.create.loading' }));

	if (!Services.getEcho().isConnected) {
		dispatch(setFormError(FORM_SIGN_UP, 'accountName', 'Connection error'));
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));

		return false;
	}

	try {

		const wif = CryptoService.generateWIF();

		const echoRandKey = CryptoService.generateEchoRandKey();

		const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();

		await Services.getEcho().api.registerAccount(accountName.value, publicKey, publicKey, publicKey, echoRandKey);

		const accountData = await Services.getEcho().api.getAccountByName(accountName.value);

		const userStorage = Services.getUserStorage();

		dispatch(addAccount(accountData.id, accountName.value));
		await userStorage.addAccount(Account.create(accountData.id, accountName.value));
		await userStorage.addKey(Key.create(publicKey, wif, accountData.id));

		return { wif, accountName: accountName.value };
	} catch (err) {
		dispatch(setFormError(FORM_SIGN_UP, 'accountName', err.message || err));

		return null;
	} finally {
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));
	}

};
