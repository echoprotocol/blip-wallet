import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { MODAL_BACKUP, MODAL_LOGOUT } from '../constants/modal-constants';

const DEFAULT_FIELDS = Map({ show: false });

const DEFAULT_MODAL_FIELDS = {
	[MODAL_BACKUP]: Map({
		accountId: null,
	}),
	[MODAL_LOGOUT]: Map({
		accountId: null,
		accountName: null,
		all: false,
	}),
};
export default createModule({
	name: 'modals',
	initialState: Map({
		[MODAL_BACKUP]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_BACKUP]),
		[MODAL_LOGOUT]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_LOGOUT]),
	}),
	transformations: {
		open: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, 'show'], true);
				const modal = state.get(payload.type).merge(payload.data);
				state = state.set(payload.type, modal);

				return state;
			},
		},
		close: {
			reducer: (state, { payload }) => state.setIn(
				[payload.type],
				_.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[payload.type]),
			),
		},
	},
});
