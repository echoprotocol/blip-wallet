// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { echoReducer } from 'echojs-lib';
import AnimationReducer from './animation-reducer';

import FormReducer from './form-reducer';
import GlobalReducer from './global-reducer';
import WalletReducer from './wallet-reducer';

export default function createRootReducer(history) {
	return combineReducers({
		form: FormReducer.reducer,
		global: GlobalReducer.reducer,
		wallet: WalletReducer.reducer,
		router: connectRouter(history),
		animation: AnimationReducer.reducer,
		echoCache: echoReducer(),
	});
}
