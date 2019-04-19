import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const DEFAULT_STATE = Map({
	activeTabIndex: 0,
});

export default createModule({
	name: 'auth',
	initialState: DEFAULT_STATE,
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.set(payload.field, payload.value);

				return state;
			},
		},
	},
});
