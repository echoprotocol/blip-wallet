import GlobalReducer from '../reducers/global-reducer';
import Services from '../services';
import UserStorageService from '../services/user-storage-service';
import { NETWORKS } from '../constants/global-constants';
import { history } from '../store/configureStore';
import { AUTHORIZATION, SELECT_LANGUAGE } from '../constants/routes';

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

export const initApp = (store) => async (dispatch, getState) => {
	const { pathname } = getState().router.location;

	dispatch(setValue('loading', 'global.loading'));

	const language = localStorage.getItem('locale');

	if (language) {
		dispatch(setValue('language', language));
	} else if (pathname === '/') {
		history.push(SELECT_LANGUAGE);
		dispatch(setValue('locked', false));
	}

	const networkId = localStorage.getItem('network') || Object.keys(NETWORKS)[0];
	const password = 'password';

	try {
		const userStorage = Services.getUserStorage();
		await userStorage.init();
		await userStorage.setNetworkId(networkId);

		const doesDBExist = await userStorage.doesDBExist();

		if (!doesDBExist) {
			await userStorage.createDB(password);
		}
		await userStorage.setScheme(UserStorageService.SCHEMES.AUTO, password);

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
export const setLanguage = () => (dispatch, getState) => {
	const language = getState().global.get('language');

	localStorage.setItem('locale', language);
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

	if (value) {
		history.push(AUTHORIZATION);
	}
};
