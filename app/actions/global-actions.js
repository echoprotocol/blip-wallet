import GlobalReducer from '../reducers/global-reducer';
import Services from '../services';
import { history } from '../store/configureStore';
import UserStorageService from '../services/user-storage-service';
import { AUTHORIZATION, UNLOCK } from '../constants/routes-constants';
import { startAnimation } from './animation-actions';
import { setValue as setValueToForm } from './form-actions';
import { NETWORKS } from '../constants/global-constants';
import LanguageService from '../services/language';

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

const setIsConnected = (status) => (dispatch) => {
	dispatch(setValue('isConnected', status));
};

export const initAccounts = () => async (dispatch, getState) => {
	const userStorage = Services.getUserStorage();

	const accounts = await userStorage.getAllAccounts();

	let accountsStore = getState().global.get('accounts');

	accountsStore = accountsStore.withMutations((mapAccounts) => {
		accounts.forEach((account) => {
			mapAccounts.set(account.id, account.name);
		});
	});

	dispatch(setValue('accounts', accountsStore));
};


export const initApp = (store) => async (dispatch) => {

	dispatch(setValue('loading', 'global.loading'));

	const language = LanguageService.getCurrentLanguage();

	if (language) {
		dispatch(setValue('language', language));
	}

	const networkId = localStorage.getItem('network') || Object.keys(NETWORKS)[0];

	try {

		const userStorage = Services.getUserStorage();
		await userStorage.init();
		await userStorage.setNetworkId(networkId);

		dispatch(setValue('inited', true));

		await Services.getEcho().init(networkId, { store }, (status) => dispatch(setIsConnected(status)));
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
	try {
		dispatch(setValueToForm(form, 'loading', true));
		const userStorage = Services.getUserStorage();
		await userStorage.deleteDB(password);
		await userStorage.createDB(password);

		await userStorage.setScheme(UserStorageService.SCHEMES.AUTO, password);
		await dispatch(initAccounts());
		dispatch(setValue('locked', false));
		history.push(AUTHORIZATION);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	} finally {
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
	try {
		dispatch(setValueToForm(form, 'loading', true));

		const userStorage = Services.getUserStorage();
		const doesDBExist = await userStorage.doesDBExist();

		if (!doesDBExist) {
			return false;
		}
		await userStorage.setScheme(UserStorageService.SCHEMES.AUTO, password);
		const correctPassword = await userStorage.isMasterPassword(password);

		if (correctPassword) {
			setTimeout(() => {
				dispatch(startAnimation(UNLOCK, false));
			}, 4000);

			return true;
		}
		dispatch(setValueToForm(form, 'error', 'Please, enter correct password'));
		return false;
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
	dispatch(startAnimation(pathname, false));
	setTimeout(() => {
		dispatch(setValue('locked', true));
		dispatch(startAnimation(UNLOCK, true));
	}, 200);
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
export const clearWalletData = () => async (dispatch) => {

	const userStorage = Services.getUserStorage();
	const doesDBExist = await userStorage.doesDBExist();

	if (doesDBExist) {
		await userStorage.deleteDB();
	}

	LanguageService.resetLanguage();

	dispatch(setValue('language', LanguageService.getDefaultLanguage()));

};
