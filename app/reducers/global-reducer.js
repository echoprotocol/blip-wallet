import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

import { EN_LOCALE } from '../constants/global-constants';

const DEFAULT_FIELDS = Map({
	language: EN_LOCALE,
	loading: '',
	isConnected: false,
	currentNode: 'remote',
	localNodePercent: 0,
	accounts: new Map({}),
	locked: true,
	inited: false,
	platform: null,
	networks: new List([]),
});

export default createModule({
	name: 'global',

	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},

		lockToggle: {
			reducer: (state, { payload }) => state.set('locked', !payload.value),
		},
		setIn: {
			reducer: (state, { payload }) => {
				Object.keys(payload.params).forEach((field) => {
					state = state.setIn([payload.field, field], payload.params[field]);
				});

				return state;
			},
		},
		clear: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, DEFAULT_FIELDS.get(payload.field));

				return state;
			},
		},
		remove: {
			reducer: (state, { payload }) => {
				state = state.deleteIn([payload.field, payload.param]);

				return state;
			},
		},
	},
});
