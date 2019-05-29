import FormatHelper from '../helpers/format-helper';
import Services from '../services';
import { setValue, clearValue, initAccounts } from './global-actions';
import { init as initWallet, reset as clearWallet } from './balance-actions';

import SettingReducer from '../reducers/setting-reducer';

/**
 * @method set
 *
 * Set value by field
 *
 * @param field
 * @param value
 * @returns {Function}
 */
export const set = (field, value) => (dispatch) => {
	dispatch(SettingReducer.actions.set({ field, value }));
};

/**
 * @method changeNetwork
 *
 * Change connection
 *
 * @param network
 * @returns {Function}
 */
export const changeNetwork = (network) => async (dispatch, getState) => {
	const networks = getState().global.get('networks');
	const current = networks.find((n) => n.get('active'));

	await Services.getUserStorage().setNetworkId(network.get('id'));
	await Services.getEcho().changeConnection(network.get('id'));
	Services.getEcho().setOptions([], network.get('id'));

	dispatch(setValue(
		'networks',
		networks
			.setIn([networks.indexOf(current), 'active'], false)
			.setIn([networks.indexOf(network), 'active'], true),
	));

	Services.getLocalStorage().setData('current_network', network.get('id'));

	dispatch(clearValue('accounts'));
	dispatch(clearWallet());

	await dispatch(initAccounts());
	await dispatch(initWallet());
};

/**
 * @method applySettings
 *
 * Apply settings changes
 *
 * @param settings
 * @returns {Function}
 */
export const applySettings = ({ network }) => async (dispatch) => {
	dispatch(set('loading', true));

	try {
		if (network) {
			await dispatch(changeNetwork(network));
		}
	} catch (e) {
		dispatch(set('error', FormatHelper.getError(e)));

	} finally {
		dispatch(set('loading', false));

	}
};
