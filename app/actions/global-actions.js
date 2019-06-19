import { Map, fromJS } from 'immutable';
import { PrivateKey } from 'echojs-lib';

import GlobalReducer from '../reducers/global-reducer';
import Services from '../services';
import { history } from '../store/configureStore';
import UserStorageService from '../services/user-storage-service';
import {
	UNLOCK, CREATE_PASSWORD,
	AUTHORIZATION, WALLET,
	INDEX_ROUTE,
} from '../constants/routes-constants';
import { startAnimation, setValue as setAnamationValue } from './animation-actions';
import { setValue as setValueToForm } from './form-actions';
import { NETWORKS, DEFAULT_NETWORK_ID } from '../constants/global-constants';
import LanguageService from '../services/language';
import Listeners from '../services/listeners';
import { initTokens, subscribeTokens, updateBalance } from './balance-actions'; // eslint-disable-line import/no-cycle
import ViewHelper from '../helpers/view-helper';

let ipcRenderer;

try {
	/* eslint-disable global-require */
	const electron = require('electron');
	({ ipcRenderer } = electron);
} catch (e) {
	console.log('Err electron import');
}

/**
 *  @method setValue
 *
 * 	Set value to global reducer
 *
 * 	@param {String} field
 * 	@param {String} value
 */
export const setValue = (field, value) => (dispatch) => {
	dispatch(GlobalReducer.actions.set({ field, value }));
};


/**
 *
 * *  @method setInValue
 *
 * @param field
 * @param params
 * @returns {Function}
 */
export const setInValue = (field, params) => (dispatch) => {
	dispatch(GlobalReducer.actions.setIn({ field, params }));
};

/**
 *  @method clearValue
 *
 * 	Clear value to global reducer
 *
 * 	@param {String} field
 */
export const clearValue = (field) => (dispatch) => {
	dispatch(GlobalReducer.actions.clear({ field }));
};

/**
 *  @method initNetworks
 *
 * 	Set value to global reducer
 *
 * 	@param store
 */
export const initNetworks = (store) => async (dispatch) => {
	let current = Services.getLocalStorage().getData('current_network');
	if (!current || !NETWORKS[current]) {
		current = DEFAULT_NETWORK_ID;
		Services.getLocalStorage().setData('current_network', current);
	}

	const networks = Object.entries(NETWORKS).map(([id, value]) => ({
		id,
		remote: value.remote,
		active: current === id,
	}));

	await Services.getUserStorage().setNetworkId(current);
	await Services.getEcho().init(current, { store });

	Services.getEcho().setOptions([], current);

	dispatch(setValue('networks', fromJS(networks)));
};

/**
 *  @method setAccounts
 */
export const setAccounts = () => (async () => {

	const userStorage = Services.getUserStorage();
	const accounts = await userStorage.getAllAccounts();
	const networkId = await userStorage.getNetworkId();

	const keyPromises = accounts.map((account) => new Promise(async (resolve) => {

		const keys = await userStorage.getAllWIFKeysForAccount(account.id);

		return resolve(keys.map((key) => ({
			id: account.id,
			key: PrivateKey.fromWif(key.wif).toPrivateKeyString(),
		})));

	}));

	const accountsKeysResults = await Promise.all(keyPromises);
	const accountsKeys = [];

	accountsKeysResults.forEach((accountKeysArr) => {
		accountKeysArr.forEach((accountKey) => {
			accountsKeys.push(accountKey);
		});
	});

	Services.getEcho().setOptions(accountsKeys, networkId);

});

/**
 *  @method initAccounts
 */
export const initAccounts = () => async (dispatch, getState) => {
	const userStorage = Services.getUserStorage();

	const accounts = await userStorage.getAllAccounts();

	let accountsStore = getState().global.get('accounts');


	accountsStore = accountsStore.withMutations((mapAccounts) => {
		accounts.forEach((account) => {
			mapAccounts.setIn([account.id, 'name'], account.name);
			mapAccounts.setIn([account.id, 'selected'], account.selected);
			mapAccounts.setIn([account.id, 'primary'], account.primary);
		});
	});

	try {
		await Services.getEcho().api.getFullAccounts(accounts.map(({ id }) => id));
	} catch (e) {
		console.log('initAccounts error', e);
	}


	dispatch(setValue('accounts', accountsStore));
	dispatch(setAccounts());
	await dispatch(subscribeTokens());

	const { pathname } = getState().router.location;
	if ([INDEX_ROUTE, AUTHORIZATION].includes(pathname)) {
		history.push(accountsStore.size ? WALLET : AUTHORIZATION);
	}

};

/**
 *  @method initApp
 *
 * 	Initialization application
 *
 * 	@param {Object} store - redux store
 */
export const initApp = (store) => async (dispatch, getState) => {
	if (ipcRenderer) {
		ipcRenderer.send('showWindow');
	}

	const listeners = new Listeners();
	listeners.initListeners(dispatch, getState);

	dispatch(setValue('loading', 'global.loading'));

	const language = LanguageService.getCurrentLanguage();

	if (language) {
		dispatch(setValue('language', language));

		if (ipcRenderer) {

			ipcRenderer.send('setLanguage', language);

			const platform = await Services.getMainProcessAPIService().getPlatform();

			dispatch(setValue('platform', platform));

		}

	}

	try {
		const userStorage = Services.getUserStorage();
		await userStorage.init();

		await dispatch(initNetworks(store));

		dispatch(setInValue('inited', { app: true }));
	} catch (err) {
		console.warn(err.message || err);
	} finally {
		dispatch(setValue('loading', ''));
	}

};

/**
 *  @method createDB
 *
 *  Create password
 *
 * 	@param {String} form
 * 	@param {String} password
 */
export const createDB = (form, password) => async (dispatch) => {
	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'restorePassword.loading' }));
	const promiseLoader = ViewHelper.timeout();
	const promiseCreateDB = new Promise(async (resolve) => {
		dispatch(setValueToForm(form, 'loading', true));
		const userStorage = Services.getUserStorage();
		await userStorage.deleteDB(password);
		await userStorage.createDB(password);

		await userStorage.setScheme(UserStorageService.SCHEMES.AUTO, password);
		await dispatch(initAccounts());
		await dispatch(initTokens());
		await dispatch(updateBalance());
		resolve();
	});

	try {
		await Promise.all([promiseCreateDB, promiseLoader]);
		dispatch(setValue('locked', false));
		await dispatch(startAnimation(CREATE_PASSWORD, 'isVisible', false));
		history.push(AUTHORIZATION);
	} catch (err) {
		await dispatch(startAnimation(CREATE_PASSWORD, 'isVisible', false));
		console.error(err);
	} finally {
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));
		dispatch(setValueToForm(form, 'loading', false));
	}
};

/**
 *  @method validateUnlock
 *
 *  Unlock Wallet
 *
 * 	@param {String} form
 * 	@param {String} password
 */
export const validateUnlock = (form, password) => async (dispatch) => {

	const promiseLoader = ViewHelper.timeout();
	const promiseValidateUnlock = new Promise(async (resolve) => {
		dispatch(setValueToForm(form, 'loading', true));

		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();

		if (!doesDBExist) {
			return resolve({ result: false, action: null });
		}
		await userStorage.setScheme(UserStorageService.SCHEMES.AUTO, password);
		const correctPassword = await userStorage.isMasterPassword(password);

		if (correctPassword) {
			await dispatch(initAccounts());
			await dispatch(initTokens());
			await dispatch(updateBalance());
			return resolve({ result: true });
		}

		return resolve({ result: false, action: () => dispatch(setValueToForm(form, 'error', 'Please, enter correct password')) });
	});

	try {
		const resultValidateUnlock = await Promise.all([promiseValidateUnlock, promiseLoader]);
		if (!resultValidateUnlock[0].result && resultValidateUnlock[0].action) {
			resultValidateUnlock[0].action();
		}
		return resultValidateUnlock[0].result;
	} catch (err) {
		console.error(err);
		return false;
	} finally {
		dispatch(setValueToForm(form, 'loading', false));
	}
};

export const lockApp = () => async (dispatch, getState) => {
	const { pathname } = getState().router.location;

	const userStorage = Services.getUserStorage();
	await userStorage.resetCurrentScheme();
	await dispatch(startAnimation(pathname, 'isVisible', false));

	dispatch(setValue('locked', true));
	dispatch(setValue('accounts', new Map({})));

	dispatch(setAnamationValue(UNLOCK, 'showLogo', true));
	dispatch(setAnamationValue(CREATE_PASSWORD, 'showLogo', true));
	dispatch(setInValue('inited', { animation: true }));

	dispatch(startAnimation(UNLOCK, 'isVisible', true));


};

/**
 *  @method setLanguage
 *
 * 	Set app language
 *
 */
export const setLanguage = () => (dispatch, getState) => {
	const language = getState().global.get('language');
	LanguageService.setCurrentLanguage(language);
};

/**
 *  @method clearWalletData
 *
 * 	clear blip wallet
 *
 */
export const clearWalletData = () => async (dispatch, getState) => {
	const { pathname } = getState().router.location;
	const userStorage = Services.getUserStorage();
	const doesDBExist = await userStorage.doesDBExist();

	if (doesDBExist) {
		await userStorage.deleteDB();
	}

	LanguageService.resetLanguage();

	dispatch(setValue('language', LanguageService.getDefaultLanguage()));
	dispatch(setValue('locked', true));
	dispatch(setValue('accounts', new Map({})));

	await dispatch(startAnimation(pathname, 'isVisible', false));
	await dispatch(startAnimation(CREATE_PASSWORD, 'isVisible', true));
	history.push(CREATE_PASSWORD);

};
