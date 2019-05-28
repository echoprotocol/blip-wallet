import { fromJS } from 'immutable';

import { NETWORKS } from '../constants/global-constants';
import Services from '../services';

import SettingReducer from '../reducers/setting-reducer';

export const initNetworks = (store) => async (dispatch) => {
	let networks = localStorage.getItem('networks');
	let current = networks ? networks.find((n) => n.active) : null;

	if (!networks) {
		networks = Object.entries(NETWORKS).map(([id, value]) => ({
			...value,
			id,
			active: false,
		}));
		[current] = networks;
		networks[0].active = true;
		// TODO save in db
	}

	await Services.getUserStorage().setNetworkId(current.id);
	await Services.getEcho().init(current.id, { store });

	Services.getEcho().setOptions([], current.id);

	dispatch(SettingReducer.actions.set({ field: 'networks', value: fromJS(networks) }));

};

export const changeNetwork = (network) => async (dispatch, getState) => {
	const networks = getState().settings.get('networks');
	const current = networks.find((n) => n.get('active'));

	try {
		await Services.getUserStorage().setNetworkId(network.get('id'));
		Services.getEcho().setNetworkGroup(current.id);
		Services.getEcho().setOptions([], network.get('id'));
		dispatch(SettingReducer.actions.set({
			field: 'networks',
			value: networks
				.setIn([networks.indexOf(current), 'active'], false)
				.setIn([networks.indexOf(network), 'active'], true),
		}));

		// TODO save in db
	} catch (e) {
		console.log('ERRR CHANGE', e);
	}
};
