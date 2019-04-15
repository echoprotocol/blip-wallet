import Services from '../services';
import { setValue as setGlobal } from './global-actions';
import WalletReducer from '../reducers/wallet-reducer';
import { ECHO_ASSET_ID } from '../constants/global-constants';

/**
 *  @method setValue
 *
 * 	Set value to wallet reducer
 *
 * 	@param {String} field
 * 	@param {String} value
 */
export const setValue = (field, value) => (dispatch) => {
	dispatch(WalletReducer.actions.set({ field, value }));
};

/**
 *  @method reset
 */
export const reset = () => (dispatch) => {
	dispatch(WalletReducer.actions.reset());
};

/**
 *  @method updateBalance
 *
 * 	Update asset ids and balance ids for all accounts
 */
export const updateBalance = () => async (dispatch, getState) => {
	const accounts = getState().global.get('accounts');

	const selectedAccounts = await Services.getEcho().api.getFullAccounts([...accounts.filter((acc) => acc.get('selected')).keys()]);

	const objectIds = selectedAccounts.reduce((balances, account) => {
		const result = Object.entries(account.balances).reduce((arr, b) => [...arr, ...b], []);
		return [...balances, ...result];
	}, []);

	await Services.getEcho().api.getObjects(objectIds);

	dispatch(reset());

	let balances = getState().wallet.get('balances');

	selectedAccounts.forEach((account) => {
		if (Object.keys(account.balances).includes(ECHO_ASSET_ID)) {
			balances = balances.set(account.balances[ECHO_ASSET_ID], ECHO_ASSET_ID);
		}
	});

	dispatch(setValue('balances', balances));
};

/**
 *  @method saveSelectedAccounts
 *
 * 	Save accounts to redux and local storage
 *
 * 	@param {Array} selectedAccounts
 */
export const saveSelectedAccounts = (selectedAccounts) => async (dispatch, getState) => {
	// Save to crypto store
	const userStorage = Services.getUserStorage();

	const accounts = await userStorage.getAllAccounts();


	accounts.forEach((account, index) => {
		accounts[index].selected = !!selectedAccounts.includes(accounts[index].id);
	});

	await userStorage.updateAccounts(accounts);

	// Save to redux
	let stateAccounts = getState().global.get('accounts');

	stateAccounts = stateAccounts.map((account, id) => {
		if (selectedAccounts.includes(id)) {
			return account.set('selected', true);
		}

		return account.set('selected', false);
	});

	dispatch(setGlobal('accounts', stateAccounts));
};
