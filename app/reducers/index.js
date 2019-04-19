// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { echoReducer } from 'echojs-lib';

import AnimationReducer from './animation-reducer';
import WalletReducer from './wallet-reducer';
import FormReducer from './form-reducer';
import GlobalReducer from './global-reducer';
import AuthReducer from './auth-reducer';


export default function createRootReducer(history) {
	return combineReducers({
		form: FormReducer.reducer,
		global: GlobalReducer.reducer,
		animation: AnimationReducer.reducer,
		auth: AuthReducer.reducer,
		wallet: WalletReducer.reducer,
		router: connectRouter(history),
		echoCache: echoReducer(),
	});
}
