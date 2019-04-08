import GlobalReducer from '../reducers/global-reducer';
import Services from '../services';
import UserStorageService from '../services/user-storage-service';

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

export const initApp = (store) => async (dispatch) => {
	const language = localStorage.getItem('locale');

	if (language) {
		dispatch(setValue('language', language));
	}

	const networkId = 'testnet';
	const password = 'password';

	const userStorage = Services.getUserStorage();
	await userStorage.init();
	await userStorage.setNetworkId(networkId);
	await userStorage.createDB(password);
	await userStorage.setScheme(UserStorageService.SCHEMES.AUTO, password);

	await Services.getEcho().init({ store }, (status) => dispatch(setIsConnected(status)));

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
