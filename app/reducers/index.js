// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import GlobalReducer from './global-reducer';

export default function createRootReducer(history) {
	return combineReducers({
		global: GlobalReducer.reducer,
		router: connectRouter(history),
	});
}
