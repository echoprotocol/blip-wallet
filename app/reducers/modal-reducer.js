import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import { MODAL_BACKUP } from '../constants/modal-constants';

const DEFAULT_FIELDS = Map({ show: false });

const DEFAULT_MODAL_FIELDS = {
	[MODAL_BACKUP]: Map({}),
};
export default createModule({
	name: 'modal',
	initialState: Map({
		[MODAL_BACKUP]: _.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[MODAL_BACKUP]),
	}),
	transformations: {
		open: {
			reducer: (state, { payload }) => state.setIn([payload.type, 'show'], true),
		},
		close: {
			reducer: (state, { payload }) => state.setIn(
				[payload.type],
				_.cloneDeep(DEFAULT_FIELDS).merge(DEFAULT_MODAL_FIELDS[payload.type]),
			),
		},
	},
});
