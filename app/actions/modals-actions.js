import ModalsReducer from '../reducers/modals-reducer';

export const openModal = (type, data) => (dispatch) => {
	dispatch(ModalsReducer.actions.open({ type, data }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalsReducer.actions.close({ type }));
};
