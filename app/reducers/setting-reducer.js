import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_FIELDS = Map({
	loading: false,
	error: null,
});

export default createModule({
	name: 'settings',

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
		remove: {
			reducer: (state, { payload }) => {
				state = state.deleteIn([payload.field, payload.param]);

				return state;
			},
		},
	},
});
