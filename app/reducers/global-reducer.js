import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';


const DEFAULT_FIELDS = Map({
	locked: true,
});

export default createModule({
	name: 'global',
	initialState: _.cloneDeep(DEFAULT_FIELDS),
	transformations: {

		lockToggle: {
			reducer: (state, { payload }) => state.set('locked', !payload.value),
		},
	},
});
