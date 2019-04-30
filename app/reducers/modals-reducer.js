import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { MODAL_BACKUP, MODAL_LOGOUT } from '../constants/modal-constants';

const DEFAULT_FIELDS = Map({ show: false });

const DEFAULT_MODAL_FIELDS = {
	[MODAL_BACKUP]: Map({
		show: false,
		accountId: null,
	}),
	[MODAL_LOGOUT]: Map({
		accountId: '',
		accountName: '',
	}),
};
export default createModule({
	name: 'modals',
	initialState: Map({
		[MODAL_BACKUP]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_BACKUP]),
		[MODAL_LOGOUT]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_BACKUP]),
	}),
	transformations: {
		open: {
			reducer: (state, { payload }) => state
				.setIn([payload.type, 'show'], true)
				.setIn([payload.type, 'accountId'], payload.payload.accountId)
				.setIn([payload.type, 'accountName'], payload.payload.accountName),
		},
		close: {
			reducer: (state, { payload }) => state.setIn(
				[payload.type],
				_.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[payload.type]),
			),
		},
	},
});
