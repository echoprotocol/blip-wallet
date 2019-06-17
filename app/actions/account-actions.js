import { PrivateKey, OPERATIONS_IDS, CACHE_MAPS } from 'echojs-lib';
import BN from 'bignumber.js';

import Services from '../services';

import CryptoService from '../services/crypto-service';
import { FORM_SIGN_IN, FORM_SIGN_UP } from '../constants/form-constants';
import {
	ECHO_PROXY_TO_SELF_ACCOUNT,
	ECHO_ASSET_ID,
	GLOBAL_ID_1,
	EXPIRATION_INFELICITY,
} from '../constants/global-constants';
import { toggleLoading, setValue } from './form-actions';
import { setValue as setGlobal, setValue as setValueGlobal, setAccounts } from './global-actions';
import { getOperationFee } from './transaction-actions';
import ValidateAccountHelper from '../helpers/validate-account-helper';
import ViewHelper from '../helpers/view-helper';
import GlobalReducer from '../reducers/global-reducer';
import WalletReducer from '../reducers/wallet-reducer';

import { signTransaction } from './sign-actions';

import Account from '../logic-components/db/models/account';
import Key from '../logic-components/db/models/key';
import { subscribeTokens } from './balance-actions';


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
		dispatch(setValue(FORM_SIGN_UP, 'error', error));
		dispatch(toggleLoading(form, false));

		return false;
	}

	if (!Services.getEcho().isConnected) {
		dispatch(setValue(FORM_SIGN_UP, 'error', 'Connection error'));
		dispatch(toggleLoading(form, false));

		return false;
	}

	try {
		const result = await Services.getEcho().api.lookupAccounts(accountName);

		if (result.find((i) => i[0] === accountName)) {
			dispatch(setValue(FORM_SIGN_UP, 'error', 'Account already exists'));
		}
	} catch (err) {

		dispatch(setValue(FORM_SIGN_UP, 'error', 'Account already exists'));

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
 * @param selected
 * @param primary
 */
const addAccount = (id, name, selected = true, primary) => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts');

	accounts = accounts.setIn([id, 'name'], name);
	accounts = accounts.setIn([id, 'selected'], selected);
	accounts = accounts.setIn([id, 'primary'], primary);

	dispatch(setValueGlobal('accounts', accounts));

	await Services.getEcho().api.getFullAccounts([id]);

	dispatch(subscribeTokens());
};

/**
 * @method registerAccount
 *
 * Account registration
 */
export const registerAccount = (accountName) => async (dispatch, getState) => {
	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'account.create.loading' }));
	const promiseLoader = ViewHelper.timeout();
	const promiseRegisterAccount = new Promise(async (resolve, reject) => {
		const registrator = getState().form.getIn([FORM_SIGN_UP, 'registrator']);

		if (!Services.getEcho().isConnected) {
			dispatch(setValue(FORM_SIGN_UP, 'error', 'Connection error'));
			dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));

			return resolve(false);
		}

		const echoRandKey = CryptoService.generateEchoRandKey();
		const wif = CryptoService.generateWIF();
		const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();

		try {
			if (registrator.public) {
				await Services.getEcho().remote.api.registerAccount(accountName, publicKey, echoRandKey, () => {});

			} else {
				const account = await Services.getEcho().api.getAccountByName(registrator.account);

				const options = {
					echorand_key: publicKey,
					registrar: account.id,
					referrer: account.id,
					referrer_percent: 0,
					name: accountName,
					active: {
						weight_threshold: 1,
						account_auths: [],
						key_auths: [[publicKey, 1]],
					},
					options: {
						voting_account: ECHO_PROXY_TO_SELF_ACCOUNT,
						delegating_account: account.id,
						num_committee: 0,
						votes: [],
						extensions: [],
					},
				};

				const balance = getState().echoCache.getIn([
					CACHE_MAPS.OBJECTS_BY_ID,
					getState().echoCache.getIn([CACHE_MAPS.FULL_ACCOUNTS, account.id, 'balances', ECHO_ASSET_ID]),
					'balance',
				]);
				const fee = await getOperationFee(OPERATIONS_IDS.ACCOUNT_CREATE, options);

				if (BN(fee).gt(balance)) {
					dispatch(setValue(FORM_SIGN_UP, 'error', 'Insufficient funds'));
					return resolve(false);
				}

				const tx = Services.getEcho().api.createTransaction();
				tx.addOperation(OPERATIONS_IDS.ACCOUNT_CREATE, options);

				const dynamicGlobalChainData = await Services.getEcho().api.getObject(GLOBAL_ID_1, true);

				const headBlockTimeSeconds = Math.ceil(new Date(`${dynamicGlobalChainData.time}Z`).getTime() / 1000);

				tx.expiration = headBlockTimeSeconds + EXPIRATION_INFELICITY;

				await signTransaction(account, tx);
				await tx.broadcast();
			}

			const accountData = await Services.getEcho().api.getAccountByName(accountName);

			const userStorage = Services.getUserStorage();
			const accounts = await userStorage.getAllAccounts();
			await dispatch(addAccount(accountData.id, accountName, true, accounts.length === 0));
			await userStorage.addAccount(Account.create(accountData.id, accountName, true, accounts.length === 0));
			await userStorage.addKey(Key.create(publicKey, wif, accountData.id));

			dispatch(setAccounts());

			return resolve({ wif, accountName });

		} catch (e) {
			return reject(e);
		}

	});

	try {
		const resultRegisterAccount = await Promise.all([promiseRegisterAccount, promiseLoader]);
		return resultRegisterAccount[0];
	} catch (err) {
		dispatch(setValue(FORM_SIGN_UP, 'error', err.message || err));

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
	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'account.import.loading' }));
	const promiseLoader = ViewHelper.timeout();
	const promiseImportAccount = new Promise(async (resolve) => {
		if (!Services.getEcho().isConnected) {
			dispatch(setValue(FORM_SIGN_IN, 'accountNameError', 'Connection error'));
			dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));

			return resolve(false);
		}

		const accountNameError = await validateImportAccount(accountName);
		const wifError = ValidateAccountHelper.validateWIF(wif);


		if (accountNameError || wifError) {
			dispatch(setValue(FORM_SIGN_IN, 'accountNameError', accountNameError));
			dispatch(setValue(FORM_SIGN_IN, 'wifError', wifError));
			return resolve(false);
		}

		if (CryptoService.isWIF(wif)) {

			const active = PrivateKey.fromWif(wif).toPublicKey().toString();

			const [[accountId]] = await Services.getEcho().api.getKeyReferences([active]);

			if (!accountId) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'Invalid WIF'));
				return resolve(false);
			}

			const userStorage = Services.getUserStorage();
			if (await userStorage.isWIFAdded(wif, accountId)) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF already added'));
				return resolve(false);
			}

			const account = await Services.getEcho().api.getObject(accountId);

			if (account.name !== accountName) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'This WIF does not exist'));
				return resolve(false);
			}

			const publicKeys = account.active.key_auths;

			const activeKey = publicKeys.find((key) => key[0] === active);

			if (!activeKey) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF is not active key.'));
				return resolve(false);
			}

			const publicKey = PrivateKey.fromWif(wif).toPublicKey().toString();
			const accounts = await userStorage.getAllAccounts();

			await dispatch(addAccount(accountId, accountName, true, accounts.length === 0));
			await userStorage.addAccount(Account.create(accountId, accountName, true, accounts.length === 0));
			await userStorage.addKey(Key.create(publicKey, wif, accountId));

		} else {
			const active = CryptoService.getPublicKey(accountName, wif);
			const [[accountId]] = await Services.getEcho().api.getKeyReferences([active]);

			if (!accountId) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'Invalid WIF'));
				return resolve(false);
			}

			const account = await Services.getEcho().api.getAccountByName(accountName);
			const keys = account.active.key_auths;

			const hasKey = keys.find((key) => {
				[key] = key;
				return key === active;
			});

			if (!hasKey) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF is not active key.'));
				return resolve(false);
			}

			const userStorage = Services.getUserStorage();
			if (await userStorage.isWIFAdded(wif, accountId)) {
				dispatch(setValue(FORM_SIGN_IN, 'wifError', 'WIF already added'));
				return resolve(false);
			}

			await dispatch(addAccount(accountId, accountName));
			await userStorage.addAccount(Account.create(accountId, accountName));
			await userStorage.addKey(Key.create(hasKey[0], wif, accountId));
		}

		dispatch(setAccounts());

		return resolve(true);
	});

	try {
		const resultImportAccount = await Promise.all([promiseImportAccount, promiseLoader]);
		return resultImportAccount[0];
	} catch (err) {
		dispatch(setValue(FORM_SIGN_IN, 'accountNameError', err.message || err));
		return false;
	} finally {
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));
	}
};

export const logoutAccount = (accountId) => async (dispatch, getState) => {
	const fullAccount = getState().echoCache.getIn([CACHE_MAPS.FULL_ACCOUNTS, accountId]);
	const userStorage = Services.getUserStorage();

	let storageAccounts = await userStorage.getAllAccounts();
	let storageKeys = await userStorage.getAllPublicKeys();
	const keys = fullAccount.getIn(['active', 'key_auths']);

	storageAccounts = storageAccounts.filter((a) => a.id !== accountId);
	storageKeys = storageKeys.filter((key) => keys.find(([k]) => k === key));

	if (!storageAccounts.find((a) => a.primary) && storageAccounts.length) {
		storageAccounts[0].primary = true;
	}

	await userStorage.updateAccounts(storageAccounts);
	await userStorage.removeKeys(storageKeys);

	let accounts = getState().global.get('accounts');
	let balances = getState().wallet.get('balances');
	let tokens = getState().wallet.get('tokens');
	let hiddenAssets = getState().wallet.get('hiddenAssets');
	let networkHiddenAssets = hiddenAssets.get(Services.getUserStorage().getNetworkId());

	accounts = accounts.filter((a, id) => id !== accountId);

	if (!accounts.find((a) => a.get('primary')) && accounts.size) {
		accounts = accounts.setIn([[...accounts.keys()][0], 'primary'], true);
	}

	const accountBalances = [...fullAccount.get('balances').values()];

	balances = balances.filter((b, id) => !accountBalances.includes(id));
	tokens = tokens.filter((t) => t.getIn(['account', 'id']) !== accountId);

	if (networkHiddenAssets) {
		networkHiddenAssets = networkHiddenAssets.filter((id) => [...balances.values()].includes(id));
		hiddenAssets = hiddenAssets.set(Services.getUserStorage().getNetworkId(), networkHiddenAssets);

		const localStorage = Services.getLocalStorage();
		localStorage.setData('hiddenAssets', hiddenAssets);

		dispatch(WalletReducer.actions.clear({ field: 'hiddenAssets' }));
		dispatch(WalletReducer.actions.set({ field: 'hiddenAssets', value: hiddenAssets }));
	}

	dispatch(GlobalReducer.actions.clear({ field: 'accounts' }));
	dispatch(WalletReducer.actions.clear({ field: 'balances' }));
	dispatch(WalletReducer.actions.clear({ field: 'tokens' }));

	dispatch(GlobalReducer.actions.set({ field: 'accounts', value: accounts }));
	dispatch(WalletReducer.actions.set({ field: 'balances', value: balances }));
	dispatch(WalletReducer.actions.set({ field: 'tokens', value: tokens }));

	dispatch(subscribeTokens());
};
/**
 *
 * @returns {Function}
 * @param indexAccount
 */
export const changePrimaryAccount = (indexAccount) => async (dispatch, getState) => {
	// Save to crypto store
	const userStorage = Services.getUserStorage();
	const accounts = await userStorage.getAllAccounts();

	accounts.forEach((account, index) => {
		accounts[index].primary = !![indexAccount].includes(accounts[index].id);
	});

	await userStorage.updateAccounts(accounts);

	// Save to redux
	let stateAccounts = getState().global.get('accounts');
	stateAccounts = stateAccounts.map((account, id) => {
		if ([indexAccount].includes(id)) {
			return account.set('primary', true);
		}

		return account.set('primary', false);
	});

	dispatch(setGlobal('accounts', stateAccounts));
};

export const removeAllAccounts = () => async (dispatch) => {
	const userStorage = Services.getUserStorage();

	await userStorage.updateAccounts([]);

	const storageKeys = await userStorage.getAllPublicKeys();
	await userStorage.removeKeys(storageKeys);

	Services.getLocalStorage().removeData('hiddenAssets');
	dispatch(GlobalReducer.actions.clear({ field: 'accounts' }));
	dispatch(WalletReducer.actions.clear({ field: 'balances' }));
	dispatch(WalletReducer.actions.clear({ field: 'tokens' }));
	dispatch(WalletReducer.actions.clear({ field: 'hiddenAssets' }));

	dispatch(subscribeTokens());
};
