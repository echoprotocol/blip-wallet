import { createModule } from 'redux-modules';
import { Map } from 'immutable';
import _ from 'lodash';

import {
	AUTHORIZATION,
	UNLOCK,
	ACCOUNT_CREATED,
	ACCOUNT_IMPORTED,
	RESTORE_PASSWORD,
	CREATE_PASSWORD,
} from '../constants/routes-constants';

import {
	WAITING_ANIMATION,
} from '../constants/animation-constants';

const DEFAULT_ANIMATIONS = {
	[UNLOCK]: Map({
		isVisible: false,
		showLogo: true,
	}),
	[AUTHORIZATION]: Map({
		isVisible: true,
	}),
	[ACCOUNT_CREATED]: Map({
		isVisible: true,
	}),
	[ACCOUNT_IMPORTED]: Map({
		isVisible: true,
	}),
	[RESTORE_PASSWORD]: Map({
		isVisible: true,
	}),
	[CREATE_PASSWORD]: Map({
		isVisible: false,
		showLogo: true,
	}),
	[WAITING_ANIMATION]: Map({
		active: false,
	}),
};

export default createModule({
	name: 'animation',
	initialState: Map({
		[UNLOCK]: _.cloneDeep(DEFAULT_ANIMATIONS[UNLOCK]),
		[AUTHORIZATION]: _.cloneDeep(DEFAULT_ANIMATIONS[AUTHORIZATION]),
		[ACCOUNT_CREATED]: _.cloneDeep(DEFAULT_ANIMATIONS[ACCOUNT_CREATED]),
		[ACCOUNT_IMPORTED]: _.cloneDeep(DEFAULT_ANIMATIONS[ACCOUNT_IMPORTED]),
		[CREATE_PASSWORD]: _.cloneDeep(DEFAULT_ANIMATIONS[CREATE_PASSWORD]),
		[RESTORE_PASSWORD]: _.cloneDeep(DEFAULT_ANIMATIONS[RESTORE_PASSWORD]),
		[WAITING_ANIMATION]: _.cloneDeep(DEFAULT_ANIMATIONS[WAITING_ANIMATION]),
	}),
	transformations: {
		set: {
			reducer: (state, { payload }) => {
				state = state.setIn([payload.type, payload.field], payload.value);
				return state;
			},
		},
	},
});
