import Services from '.';
import GlobalReducer from '../reducers/global-reducer';

class Listeners {

	constructor() {
		this.emitter = Services.getEmitter();
	}

	initListeners(dispatch) {
		this.setIsConnected = (status) => dispatch(dispatch(GlobalReducer.actions.set({ field: 'isConnected', value: status })));
		this.setCurrentNode = (value) => dispatch(dispatch(GlobalReducer.actions.set({ field: 'currentNode', value })));

		this.emitter.on('setIsConnected', this.setIsConnected);
		this.emitter.on('setCurrentNode', this.setCurrentNode);
	}

}

export default Listeners;
