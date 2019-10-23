import { OPERATIONS_IDS } from 'echojs-lib';

import { TEMPLATE_ECHO_KEY } from '../constants/global-constants';
import { FORM_SIGN_UP } from '../constants/form-constants';
import { getOperationFee } from './transaction-actions';
import { setInValue } from './form-actions';
import Services from '../services';

import AuthReducer from '../reducers/auth-reducer';

/**
 *  @method setValue
 *
 * 	Set value to global reducer
 *
 * 	@param {String} field
 * 	@param {String} value
 */
export const setValue = (field, value) => (dispatch) => {
	dispatch(AuthReducer.actions.set({ field, value }));
};

/**
 *
 * @param {String} value
 * @returns {Function}
 */
export const changeActiveTabIndex = (value) => (dispatch) => {
	dispatch(setValue('activeTabIndex', value));
};

/**
 *
 * @param {String} accountId
 * @returns {Function}
 */
export const getAccountCreateFee = async (accountId, name = '') => {
	const config = await Services.getEcho().api.getConfig();

	const options = {
		echorand_key: TEMPLATE_ECHO_KEY,
		registrar: accountId,
		name,
		active: {
			weight_threshold: 1,
			account_auths: [],
			key_auths: [[TEMPLATE_ECHO_KEY, 1]],
		},
		options: {
			voting_account: config.ECHO_PROXY_TO_SELF_ACCOUNT,
			delegating_account: accountId,
			num_committee: 0,
			delegate_share: 0,
			votes: [],
		},
		extensions: [],
	};

	return getOperationFee(OPERATIONS_IDS.ACCOUNT_CREATE, options);
};

/**
 *
 * @returns {Function}
 */
export const loadRegistrators = () => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts');
	accounts = await Services.getEcho().api.getFullAccounts([...accounts.keys()]);

	if (!accounts.length) {
		return;
	}

	const fee = await getAccountCreateFee(accounts[0].id);
	dispatch(setInValue(FORM_SIGN_UP, 'registrator', { fee, account: accounts[0].name }));

	const objectIds = accounts.reduce((arr, a) => [
		...arr,
		...Object.keys(a.balances),
		...Object.values(a.balances),
	], []);

	await Services.getEcho().api.getObjects(objectIds);
};

/**
 *
 * @param {String} accountId
 * @param {String} accountName
 *
 * @returns {Function}
 */
export const changeRegistratorAccount = (accountId, accountName) => async (dispatch) => {
	const fee = await getAccountCreateFee(accountId);
	dispatch(setInValue(FORM_SIGN_UP, 'registrator', { fee, account: accountName }));
};
