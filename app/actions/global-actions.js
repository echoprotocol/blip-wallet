import GlobalReducer from '../reducers/global-reducer';
import Services from '../services';


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
