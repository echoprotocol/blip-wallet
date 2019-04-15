import AnimationReducer from '../reducers/animation-reducer';

/**
 * Set value by field
 * @param {String} type
 * @param {String} value
 * @returns {Function}
 */
export const startAnimation = (type, value) => (dispatch) => {
	if (value) {
		return new Promise((resolve) => {
			setTimeout(() => {
				dispatch(AnimationReducer.actions.set({ type, value }));
				resolve();
			}, 200);
		});
	}
	dispatch(AnimationReducer.actions.set({ type, value }));
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 200);
	});


};
