import AnimationReducer from '../reducers/animation-reducer';

/**
 * Set value by field
 * @param form
 * @param field
 * @param value
 * @returns {Function}
 */
export const startAnimation = (type, value) => (dispatch) => {
	dispatch(AnimationReducer.actions.set({ type, value }));
};
