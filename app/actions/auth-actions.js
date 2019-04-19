import AuthReducer from '../reducers/auth-reducer';

/**
 *  @method setValue
 *
 * 	Set value to global reducer
 *
 * 	@param {String} field
 * 	@param {String} value
 */
export const setValue = (field, value) => (dispatch) => {
	dispatch(AuthReducer.actions.set({ field, value }));
};

/**
 *
 * @param {String} value
 * @returns {Function}
 */
export const changeActiveTabIndex = (value) => (dispatch) => {
	dispatch(setValue('activeTabIndex', value));
};
