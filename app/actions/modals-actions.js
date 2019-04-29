import ModalsReducer from '../reducers/modals-reducer';

export const openModal = (type, payload) => (dispatch) => {
	dispatch(ModalsReducer.actions.open({ type, payload }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalsReducer.actions.close({ type }));
};
