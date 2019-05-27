import { Map } from 'immutable';

import GlobalReducer from '../reducers/global-reducer';
import Services from '../services';
import { history } from '../store/configureStore';
import UserStorageService from '../services/user-storage-service';
import { UNLOCK, CREATE_PASSWORD } from '../constants/routes-constants';
import { startAnimation } from './animation-actions';
import { setValue as setValueToForm } from './form-actions';
import { NETWORKS, TIME_LOADING } from '../constants/global-constants';
import LanguageService from '../services/language';
import Listeners from '../services/listeners';
import { initTokens, subscribeTokens, updateBalance } from './balance-actions'; // eslint-disable-line import/no-cycle

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
	await dispatch(subscribeTokens());
};

/**
 *  @method initApp
 *
 * 	Initialization application
 *
 * 	@param {Object} store - redux store
 */
export const initApp = (store) => async (dispatch, getState) => {
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

	const networkId = localStorage.getItem('network') || Object.keys(NETWORKS)[0];

	try {

		const userStorage = Services.getUserStorage();
		await userStorage.init();
		await userStorage.setNetworkId(networkId);

		dispatch(setValue('inited', true));

		await Services.getEcho().init(networkId, { store });
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
	const promiseLoader = new Promise((resolve) => setTimeout(resolve, TIME_LOADING));
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
	} catch (err) {
		console.error(err);
	} finally {
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));
		await dispatch(startAnimation(CREATE_PASSWORD, false));
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
	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'unlock.loading' }));

	const promiseLoader = new Promise((resolve) => setTimeout(resolve, TIME_LOADING));
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
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));
	}
};

export const lockApp = () => async (dispatch, getState) => {
	const { pathname } = getState().router.location;

	const userStorage = Services.getUserStorage();
	await userStorage.resetCurrentScheme();
	await dispatch(startAnimation(pathname, false));

	dispatch(setValue('locked', true));
	dispatch(setValue('accounts', new Map({})));
	dispatch(startAnimation(UNLOCK, true));
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

	await dispatch(startAnimation(pathname, false));
	history.push(CREATE_PASSWORD);

};
