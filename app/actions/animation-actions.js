import AnimationReducer from '../reducers/animation-reducer';
import { CHANGE_PAGE_ANIMATION_TIME } from '../constants/animation-constants';
import ViewHelper from '../helpers/view-helper';

/**
 * Set value by field
 * @param {String} type
 * @param {String} field
 * @param {String} value
 * @returns {Function}
 */

export const startAnimation = (type, field, value) => (dispatch) => {
	if (!value) {
		dispatch(AnimationReducer.actions.set({ type, field, value }));
	}

	return new Promise((resolve) => {
		ViewHelper.timeout(() => {
			if (value) {
				dispatch(AnimationReducer.actions.set({ type, field, value }));
			}
			resolve();
		}, CHANGE_PAGE_ANIMATION_TIME);
	});

};

/**
 *  @method setValue
 *
 * 	Set value to animation reducer
 *
 * @param {String} type
 * @param {String} field
 * @param {String} value
 */

export const setValue = (type, field, value) => (dispatch) => {
	dispatch(AnimationReducer.actions.set({ type, field, value }));
};
