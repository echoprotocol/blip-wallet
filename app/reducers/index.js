// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { echoReducer } from 'echojs-lib';
import FormReducer from './form-reducer';
import GlobalReducer from './global-reducer';

export default function createRootReducer(history) {
	return combineReducers({
		form: FormReducer.reducer,
		global: GlobalReducer.reducer,
		router: connectRouter(history),
		echoCache: echoReducer(),
	});
}
