// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import globalReducer from './global-reducer';

export default function createRootReducer(history) {
	return combineReducers({
		router: connectRouter(history),
		global: globalReducer.reducer,
	});
}
