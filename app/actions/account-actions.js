import { PrivateKey } from 'echojs-lib';

import Services from '../services';
import CryptoService from '../services/crypto-service';
import { FORM_SIGN_IN, FORM_SIGN_UP } from '../constants/form-constants';
import { setFormError, toggleLoading, setValue } from './form-actions';
import { setValue as setValueGlobal } from './global-actions';
import ValidateAccountHelper from '../helpers/validate-account-helper';
import GlobalReducer from '../reducers/global-reducer';

import Account from '../logic-components/db/models/account';
import Key from '../logic-components/db/models/key';

/**
 * @method validateCreateAccount
 *
 * Validate account name and lookup
 *
 * @param form
 * @param accountName
 */
export const validateCreateAccount = (form, accountName) => async (dispatch) => {
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
			dispatch(setFormError(FORM_SIGN_UP, 'accountName', 'Account already exists'));
		}
	} catch (err) {

		dispatch(setFormError(FORM_SIGN_UP, 'accountName', 'Account already exists'));

		console.warn(err.message || err);
	} finally {
		dispatch(toggleLoading(form, false));
	}

	return true;
};

/**
 * @method addAccount
 *
 *
 * @param id
 * @param name
 */
const addAccount = (id, name) => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts');

	accounts = accounts.setIn([id, 'name'], name);
	accounts = accounts.setIn([id, 'selected'], true);

	dispatch(setValueGlobal('accounts', accounts));

	await Services.getEcho().api.getFullAccounts([id]);
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

		await dispatch(addAccount(accountData.id, accountName.value));
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

/**
 * @method validateImportAccount
 *
 * Validate account name and lookup
 *
 * @param accountName
 */
const validateImportAccount = async (accountName) => {
	const error = ValidateAccountHelper.validateAccountName(accountName);

	if (error) {
		return error;
	}

	const result = await Services.getEcho().api.lookupAccounts(accountName);

	if (!result.find((i) => i[0] === accountName)) {

		return 'This account does not exist';
	}

	return null;
};

/**
 * @method importAccount
 *
 * Import account
 *
 * @param accountName
 * @param wif
 */
export const importAccount = (accountName, wif) => async (dispatch) => {

	const accountNameError = await validateImportAccount(accountName);
	const wifError = ValidateAccountHelper.validateWIF(wif);

	if (accountNameError || wifError) {
		dispatch(setValue(FORM_SIGN_IN, 'accountNameError', accountNameError));
		dispatch(setValue(FORM_SIGN_IN, 'wifError', wifError));
		return false;
	}

	if (!Services.getEcho().isConnected) {
		dispatch(setValue(FORM_SIGN_IN, 'accountNameError', 'Connection error'));
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));

		return false;
	}

	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'account.import.loading' }));


	try {
		if (CryptoService.isWIF(wif)) {
			const active = PrivateKey.fromWif(wif).toPublicKey().toString();

			const [[accountId]] = await Services.getEcho().api.getKeyReferences([active]);

			if (!accountId) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'Invalid WIF'));
				return false;
			}

			const userStorage = Services.getUserStorage();
			if (await userStorage.isWIFAdded(wif, accountId)) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF already added'));
				return false;
			}

			const account = await Services.getEcho().api.getObject(accountId);

			if (account.name !== accountName) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'Invalid WIF'));
				return false;
			}

			const publicKeys = account.active.key_auths;

			const activeKey = publicKeys.find((key) => key[0] === active);

			if (!activeKey) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF is not active key.'));
				return false;
			}

			const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();

			await dispatch(addAccount(accountId, accountName));
			await userStorage.addAccount(Account.create(accountId, accountName));
			await userStorage.addKey(Key.create(publicKey, wif, accountId));
		} else {
			const active = CryptoService.getPublicKey(accountName, wif);
			const [[accountId]] = await Services.getEcho().api.getKeyReferences([active]);

			if (!accountId) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'Invalid WIF'));
				return false;
			}

			const account = await Services.getEcho().api.getAccountByName(accountName);
			const keys = account.active.key_auths;

			const hasKey = keys.find((key) => {
				[key] = key;
				return key === active;
			});

			if (!hasKey) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF is not active key.'));
				return false;
			}

			const userStorage = Services.getUserStorage();
			if (await userStorage.isWIFAdded(wif, accountId)) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF already added'));
				return false;
			}

			await dispatch(addAccount(accountId, accountName));
			await userStorage.addAccount(Account.create(accountId, accountName));
			await userStorage.addKey(Key.create(hasKey[0], wif, accountId));
		}
	} catch (err) {
		dispatch(setValue(FORM_SIGN_IN, 'accountNameError', err.message || err));

		return false;
	} finally {
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));
	}

	return true;
};
