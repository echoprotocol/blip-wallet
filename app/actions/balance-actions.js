import { Set, Map, fromJS } from 'immutable';
import Services from '../services';
import { setValue as setGlobal } from './global-actions'; // eslint-disable-line import/no-cycle
import WalletReducer from '../reducers/wallet-reducer';
import { getBalances } from '../services/queries/balances';
import { TOKEN_TYPE } from '../constants/graphql-constants';

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
 *
 * @returns {Function}
 */
export const initTokens = () => async (dispatch, getState) => {
	const accounts = [...getState().global.get('accounts').keys()];

	if (!accounts.length) {
		return false;
	}

	try {
		const tokens = await getBalances(accounts);

		if (!tokens || !tokens.data.getBalances.length) {
			return false;
		}

		dispatch(setValue('tokens', fromJS(tokens.data.getBalances.filter((t) => t.type === TOKEN_TYPE))));
	} catch (e) {
		console.log(e);
	}

	return true;
};

/**
 *
 * @returns {Function}
 */
export const subscribeTokens = () => async (dispatch, getState) => {
	await dispatch(initTokens());

	const source = getState().wallet.get('tokens');
	const accounts = [...getState().global.get('accounts').keys()];
	const emitter = Services.getEmitter();

	emitter.emit('subscribeTokens', accounts, source);
};

/**
 *  @method clear
 *
 *  Set default value by field
 *
 *  @param {String} field
 */
export const clear = (field) => (dispatch) => {
	dispatch(WalletReducer.actions.clear({ field }));
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

	dispatch(clear('balances'));

	let balances = new Map({});

	selectedAccounts.forEach((account) => {
		Object.entries(account.balances).forEach(([assetId, balanceId]) => {
			balances = balances.set(balanceId, assetId);
		});
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

/**
 *
 * @returns {Function}
 */
export const initHiddenAssets = () => (dispatch) => {
	const localStorage = Services.getLocalStorage();
	const dataFromStorage = localStorage.getData('hiddenAssets') || {};
	let hiddenAssets = new Map({});
	Object.keys(dataFromStorage).forEach((key) => {
		hiddenAssets = hiddenAssets.set(key, new Set(dataFromStorage[key]));
	});
	dispatch(setValue('hiddenAssets', hiddenAssets));
};

/**
 *
 * @param {String} idAsset
 * @returns {Function}
 */
export const toggleVisibiltyAsset = (idAsset) => async (dispatch, getState) => {
	const idNetwork = Services.getUserStorage().getNetworkId();
	let hiddenAssets = getState().wallet.get('hiddenAssets');

	if (!hiddenAssets.has(idNetwork)) {
		hiddenAssets = hiddenAssets.set(idNetwork, new Set());
	}

	let networkHiddenAssets = hiddenAssets.get(idNetwork);
	const localStorage = Services.getLocalStorage();

	if (networkHiddenAssets.has(idAsset)) {
		networkHiddenAssets = networkHiddenAssets.delete(idAsset);
	} else {
		networkHiddenAssets = networkHiddenAssets.add(idAsset);
	}

	hiddenAssets = hiddenAssets.set(idNetwork, networkHiddenAssets);

	localStorage.setData('hiddenAssets', hiddenAssets);
	dispatch(setValue('hiddenAssets', hiddenAssets));
};

/**
 *
 * @returns {Function}
 */
export const init = () => async (dispatch) => {
	await dispatch(initTokens());
	await dispatch(updateBalance());
	dispatch(initHiddenAssets());
};
