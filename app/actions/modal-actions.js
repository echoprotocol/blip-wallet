import ModalReducer from '../reducers/modal-reducer';

export const openModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.open({ type }));
};

export const closeModal = (type) => (dispatch) => {
	dispatch(ModalReducer.actions.close({ type }));
};
