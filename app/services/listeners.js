import Services from '.';
import GlobalReducer from '../reducers/global-reducer';
import WalletReducer from '../reducers/wallet-reducer';

class Listeners {

	constructor() {
		this.emitter = Services.getEmitter();
		this.tokenSubscribe = Services.getTokenSubscribe();
	}


	initListeners(dispatch, getState) {
		this.setIsConnected = (status) => dispatch(GlobalReducer.actions.set({ field: 'isConnected', value: status }));
		this.setCurrentNode = (value) => dispatch(GlobalReducer.actions.set({ field: 'currentNode', value }));
		this.setLocalNodePercent = (value) => {

			const state = getState();

			if (state.global.get('localNodePercent') !== value) {
				dispatch(GlobalReducer.actions.set({ field: 'localNodePercent', value }));
			}

		};

		this.subscribeTokens = (accounts, source) => this.tokenSubscribe.subscribe(accounts, source);
		this.setTokens = (tokens) => dispatch(WalletReducer.actions.set({ field: 'tokens', value: tokens }));

		this.emitter.on('setIsConnected', this.setIsConnected);
		this.emitter.on('setCurrentNode', this.setCurrentNode);
		this.emitter.on('subscribeTokens', this.subscribeTokens);
		this.emitter.on('setTokens', this.setTokens);
		this.emitter.on('setLocalNodePercent', this.setLocalNodePercent);

	}

}

export default Listeners;
