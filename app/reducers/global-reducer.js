import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';
import { EN_LOCALE } from '../constants/global-constants';

const DEFAULT_FIELDS = Map({
	language: EN_LOCALE,
	locked: true,
	loading: '',
	isConnected: false,
	accounts: new Map({}),
});

export default createModule({
	name: 'global',

	initialState: _.cloneDeep(DEFAULT_FIELDS),
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

		remove: {
			reducer: (state, { payload }) => {
				state = state.deleteIn([payload.field, payload.param]);

				return state;
			},

		},
	},
});
