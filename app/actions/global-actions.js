/* eslint-disable import/prefer-default-export */
import GlobalReducer from '../reducers/global-reducer';

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
