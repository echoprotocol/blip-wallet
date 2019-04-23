import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	balances: new Map({}),
	transaction: new Map({}),
	hiddenAssets: new Map({}),
});

export default createModule({
	name: 'wallet',

	initialState: DEFAULT_FIELDS,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
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
		reset: {
			reducer: (state) => {
				state = DEFAULT_FIELDS;

				return state;
			},
		},
	},
});
