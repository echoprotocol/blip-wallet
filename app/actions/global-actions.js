import GlobalReducer from '../reducers/global-reducer';
import Services from '../services';
import { history } from '../store/configureStore';
import UserStorageService from '../services/user-storage-service';
import { AUTHORIZATION } from '../constants/routes-constants';
import { setValue as setValueToForm } from './form-actions';
import { NETWORKS } from '../constants/global-constants';

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

	const language = localStorage.getItem('locale');

	if (language) {
		dispatch(setValue('language', language));
	}


	const networkId = localStorage.getItem('network') || Object.keys(NETWORKS)[0];

	try {
		const userStorage = Services.getUserStorage();
		await userStorage.init();
		await userStorage.setNetworkId(networkId);

		await dispatch(initAccounts());

		await Services.getEcho().init(networkId, { store }, (status) => dispatch(setIsConnected(status)));
	} catch (err) {
		console.warn(err.message || err);
	} finally {
		dispatch(setValue('loading', ''));
	}
};

/**
 *  @method setLanguage
 *
 * 	Set app language
 *
 * 	@param {String} language
 */
export const setLanguage = (language) => (dispatch) => {
	dispatch(setValue('language', language));
	localStorage.setItem('locale', language);
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
		const doesDBExist = await userStorage.doesDBExist();

		if (!doesDBExist) {
			await userStorage.createDB(password);
		}
		await userStorage.setScheme(UserStorageService.SCHEMES.AUTO, password);

		history.push(AUTHORIZATION);
		return true;
	} catch (err) {
		return false;
	} finally {
		dispatch(setValueToForm(form, 'loading', false));
	}
};

/**
 *  @method lockToggle
 *
 * 	Toggle lock visibility
 *
 * 	@param {Boolean} value
 */

export const lockToggle = (value) => (dispatch) => {
	dispatch(GlobalReducer.actions.lockToggle({ value }));
};
