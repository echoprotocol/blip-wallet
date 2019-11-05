/* eslint-disable no-restricted-syntax */
import { Set, Map, fromJS } from 'immutable';
import BN from 'bignumber.js';
import { validators } from 'echojs-lib';
import { history } from '../store/configureStore';
import Services from '../services';
import { setValue as setGlobal } from './global-actions'; // eslint-disable-line import/no-cycle
import { setValue as setForm } from './form-actions';
import WalletReducer from '../reducers/wallet-reducer';
import { getBalances } from '../services/queries/balances';
import { TOKEN_TYPE } from '../constants/graphql-constants';
import { ECHO_ASSET_ID, ECHO_ASSET_PRECISION } from '../constants/global-constants';
import { SEND } from '../constants/routes-constants';
import { FORM_SEND } from '../constants/form-constants';
import FormatHelper from '../helpers/format-helper';

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

	const selectedAccounts = await Services.getEcho().api.getFullAccounts([...accounts.keys()]);

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

/**
 *
 * @param currencyId
 * @param balances
 * @returns {Function}
 */
export const goToSend = (currencyId, balances) => (dispatch, getState) => {
	const accounts = getState().global.get('accounts');

	if (validators.isContractId(currencyId)) {
		const tokens = getState().wallet.get('tokens');

		const primaryAccountToken = tokens
			.find((token) => token.getIn(['contract', 'id']) === currencyId
				&& accounts.find((account, id) => id === token.getIn(['account', 'id']) && account.get('primary')));

		const data = {
			balanceId: '',
			accountId: '',
			symbol: '',
		};

		if (primaryAccountToken) {
			data.balanceId = primaryAccountToken.getIn(['contract', 'id']);
			data.accountId = primaryAccountToken.getIn(['account', 'id']);
			data.symbol = primaryAccountToken.getIn(['contract', 'token', 'symbol']);
		} else {
			const balance = tokens
				.find((t) => t.getIn(['contract', 'id']) === currencyId
					&& accounts.find((account, id) => id === t.getIn(['account', 'id'])));

			data.balanceId = balance ? balance.getIn(['contract', 'id']) : '';
			data.accountId = balance ? balance.getIn(['account', 'id']) : '';
			data.symbol = balance ? balance.getIn(['contract', 'token', 'symbol']) : '';
		}

		history.push(SEND);

		dispatch(setForm(FORM_SEND, 'selectedBalance', data.balanceId));
		dispatch(setForm(FORM_SEND, 'initialData', { accountId: data.accountId, symbol: data.symbol }));

		return true;
	}

	const primaryAccountBalance = balances
		.find((balance) => balance.asset.get('id') === currencyId
			&& accounts.find((account, id) => id === balance.owner && account.get('primary')));

	const data = {
		balanceId: '',
		accountId: '',
		symbol: '',
	};

	if (primaryAccountBalance) {
		data.balanceId = primaryAccountBalance.id;
		data.accountId = primaryAccountBalance.owner;
		data.symbol = primaryAccountBalance.asset.get('symbol');
	} else {
		const balance = balances
			.find((b) => b.asset.get('id') === currencyId
				&& accounts.find((account, id) => id === b.owner));

		data.balanceId = balance ? balance.id : '';
		data.accountId = balance ? balance.owner : '';
		data.symbol = balance ? balance.asset.get('symbol') : '';
	}

	history.push(SEND);

	dispatch(setForm(FORM_SEND, 'selectedBalance', data.balanceId));
	dispatch(setForm(FORM_SEND, 'initialData', { accountId: data.accountId, symbol: data.symbol }));


	return true;
};

export const totalFreezeSum = (frozenBalances) => {
	let totalAmount = new BN(0);
	for (const fBalance in frozenBalances) {
		if (frozenBalances[fBalance].balance) {
			totalAmount = totalAmount.plus(new BN(frozenBalances[fBalance].balance.amount));
		}
	}
	return totalAmount.div(10 ** ECHO_ASSET_PRECISION).toString(10);
};

export const getFrozenBalance = () => async (dispatch, getState) => {
	const accounts = getState().global.get('accounts').toJS();
	const currentAccIds = [];
	for (const account in accounts) {
		if (accounts[account].selected) {
			currentAccIds.push(account);
		}
	}
	const frozenBalances = [];
	const results = [];
	for (let i = 0; i < currentAccIds.length; i += 1) {
		results.push(Services.getEcho().api.getFrozenBalances(currentAccIds[i]));
	}
	await Promise.all(results).then((res) => {
		let freezeSum = new BN(0);
		for (let i = 0; i < res.length; i += 1) {
			const fSum = new BN(totalFreezeSum(res[i]));
			freezeSum = freezeSum.plus(fSum);
		}
		freezeSum = freezeSum.toString();
		dispatch(setValue('frozenBalances', frozenBalances));
		dispatch(setValue('freezeSum', freezeSum));
	});
};

export const getBalance = (balances) => {
	if (!balances.size) {
		return null;
	}
	const amounts = Object.values(balances.toJS()).reduce((acc, v) => (v.asset.id === ECHO_ASSET_ID ? [...acc, v.amount.toString()] : acc), []);

	const result = FormatHelper.accumulateBalances(amounts);

	return FormatHelper.formatAmount(result, ECHO_ASSET_PRECISION);
};
