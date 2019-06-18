import AnimationReducer from '../reducers/animation-reducer';

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
		setTimeout(() => {
			if (value) {
				dispatch(AnimationReducer.actions.set({ type, field, value }));
			}
			resolve();
		}, 200);
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
