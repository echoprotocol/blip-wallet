import { OPERATIONS_IDS } from 'echojs-lib';

import { ECHO_PROXY_TO_SELF_ACCOUNT } from '../constants/global-constants';
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
export const getAccountCreateFee = (accountId, name = '') => {
	const options = {
		ed_key: 'a896c9386aaa87026b3ee48d4df90badbc2f246374077722c519687af083c3a3',
		registrar: accountId,
		referrer: accountId,
		referrer_percent: 0,
		name,
		owner: {
			weight_threshold: 1,
			account_auths: [],
			key_auths: [['ECHO6TabpHPGAKwgkDASeCC5ya4pguTEBah7rEVjfnAsNAzcqtUDD1', 1]],
			address_auths: [],
		},
		active: {
			weight_threshold: 1,
			account_auths: [],
			key_auths: [['ECHO6TabpHPGAKwgkDASeCC5ya4pguTEBah7rEVjfnAsNAzcqtUDD1', 1]],
			address_auths: [],
		},
		options: {
			memo_key: 'ECHO6TabpHPGAKwgkDASeCC5ya4pguTEBah7rEVjfnAsNAzcqtUDD1',
			voting_account: ECHO_PROXY_TO_SELF_ACCOUNT,
			delegating_account: accountId,
			num_witness: 0,
			num_committee: 0,
			votes: [],
			extensions: [],
		},
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
	accounts = accounts.filter((a) => (a.balances && a.id === a.lifetime_referrer));

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
