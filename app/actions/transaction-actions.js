import { Map, fromJS } from 'immutable';
import { validators, CACHE_MAPS } from 'echojs-lib';

import WalletReducer from '../reducers/wallet-reducer';

import {
	OPERATION_ID_PREFIX, OPTION_TYPES, OPERATIONS,
	CONTRACT_TYPES, CONTRACT_RESULT_TYPE_0, CONTRACT_RESULT_EXCEPTED_NONE,
} from '../constants/transaction-constants';
import { ASSET_TYPE, TOKEN_TYPE, DEFAULT_HISTORY_COUNT } from '../constants/graphql-constants';
import {
	ECHO_ASSET_ID, ECHO_ASSET_SYMBOL, ECHO_ASSET_PRECISION, EETH_ASSET_SYMBOL, ERC20_TOKEN_PRECISION,
} from '../constants/global-constants';
import ViewHelper from '../helpers/view-helper';
import Services from '../services';
import { getHistoryByAccounts, getCoinsByAccounts } from '../services/queries/transaction-queries';

/**
 * Set value by field
 * @param field
 * @param value
 * @returns {Function}
 */
export const set = (field, value) => (dispatch) => {
	dispatch(WalletReducer.actions.set({ field, value }));
};


/**
 * Set params by field
 * @param field
 * @param params
 * @returns {Function}
 */
export const setIn = (field, params) => (dispatch) => {
	dispatch(WalletReducer.actions.setIn({ field, params }));
};

/**
 * Set params by field
 * @param field
 * @param params
 * @returns {Function}
 */
export const mergeIn = (field, params) => (dispatch) => {
	dispatch(WalletReducer.actions.mergeIn({ field, params }));
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
 * Clear params by field
 * @param field
 * @param params
 * @returns {Function}
 */
export const clearIn = (field, params) => (dispatch) => {
	dispatch(WalletReducer.actions.clearIn({ field, params }));
};

/**
 *  @method formatTransaction
 *
 *  Format operation
 *
 *  @param {Number} type
 *  @param {Immutable.Map} operation
 *  @param {String} blockNumber
 *  @param {String} resultId
 *  @params {String[]} [accounts]
 */
export const formatTransaction = async (type, operation, blockNumber, resultId, accounts = []) => {

	if (!operation.size || !blockNumber) {
		return new Map({});
	}

	const block = await Services.getEcho().api.getBlock(blockNumber);

	let { name, options } = Object.values(OPERATIONS).find((i) => i.value === type);

	if (type === OPERATIONS.transfer.value) {
		name = accounts.includes(operation.get('from')) ? `${name}.sent` : `${name}.received`;
	}

	const object = {
		type,
		name,
		timestamp: block.timestamp,
	};

	if (operation.get('fee')) {
		const feeAsset = await Services.getEcho().api.getObject(operation.getIn(['fee', 'asset_id']));
		object.fee = {
			amount: operation.getIn(['fee', 'amount']),
			precision: feeAsset.precision,
			symbol: feeAsset.symbol,
		};
	}

	if (CONTRACT_TYPES.includes(type)) {
		const result = await Services.getEcho().api.getContractResult(resultId);
		object.code = operation.get('code');
		object.status = result[0] === CONTRACT_RESULT_TYPE_0 ? result[1].exec_res.excepted === CONTRACT_RESULT_EXCEPTED_NONE : true;
	}

	options = Object.entries(options).map(async ([key, value]) => {
		if (!value) { return value; }

		let response;
		const base = { key, type: value.type };
		const field = value.field ? operation.getIn(value.field.split('.')) : value.field;


		switch (value.type) {
			case OPTION_TYPES.ACCOUNT:
				response = await Services.getEcho().api[validators.isAccountId(field) ? 'getObject' : 'getAccountByName'](field);

				return {
					...base,
					link: `/accounts/${response.id}/info`,
					label: value.label,
					value: response.name,
					id: response.id,
				};
			case OPTION_TYPES.CONTRACT:
				return {
					...base,
					link: `/contracts/${field}/info`,
					label: value.label,
					value: field,
					id: field,
				};
			case OPTION_TYPES.ECHO_ASSET:
			case OPTION_TYPES.ASSET:
				response = await Services.getEcho().api.getObject(field || ECHO_ASSET_ID);

				return {
					...base,
					link: `/assets/${response.id}/info`,
					label: value.label,
					value: response.symbol,
					precision: response.precision,
					id: response.id,
				};
			case OPTION_TYPES.STRING:
			case OPTION_TYPES.NUMBER:
			case OPTION_TYPES.ACCOUNT_ADDRESS:
			case OPTION_TYPES.CONTRACT_ADDRESS: {
				const result = {
					...base,
					label: value.label,
					value: field,
				};
				if (type === OPERATIONS.asset_create.value) {
					result.link = `/assets/${resultId}/info`;
				}
				return result;
			}
			case OPTION_TYPES.EETH_ASSET:
				[response] = await Services.getEcho().api.lookupAssetSymbols([EETH_ASSET_SYMBOL]);

				return {
					...base,
					link: `/assets/${response.id}/info`,
					label: value.label,
					value: response.symbol,
					precision: response.precision,
					id: response.id,
				};
			case OPTION_TYPES.ERC20_TOKEN:
				return {
					...base,
					value: '',
					precision: ERC20_TOKEN_PRECISION,
				};
			default:
				throw new Error('Unknown option type');
		}
	});

	options = await Promise.all(options);
	options = options.filter((o) => o).reduce((obj, o) => ({ ...obj, [o.key]: o }), {});

	return fromJS({ ...object, ...options });
};

/**
 * Set last transaction by selected accounts
 * @returns {Function}
 */
export const setLastTransaction = () => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts').filter((a) => a.get('selected'));

	if (!accounts.size) {
		dispatch(clear('transaction'));
		return;
	}

	accounts = accounts.map((name, id) => getState().echoCache.getIn([CACHE_MAPS.FULL_ACCOUNTS, id]));

	const account = accounts.sort((a, b) => {
		a = (a.getIn(['history', '0', 'id']) || OPERATION_ID_PREFIX).slice(OPERATION_ID_PREFIX.length);
		b = (b.getIn(['history', '0', 'id']) || OPERATION_ID_PREFIX).slice(OPERATION_ID_PREFIX.length);
		return Number(a) < Number(b) ? 1 : -1;
	}).first();

	let transaction = account.getIn(['history', '0']);

	if (!transaction) {
		dispatch(clear('transaction'));
		return;
	}

	transaction = await formatTransaction(
		transaction.getIn(['op', '0']),
		transaction.getIn(['op', '1']),
		transaction.get('block_num'),
		transaction.getIn(['result', '1']),
		[account.get('id')],
	);

	dispatch(set('transaction', transaction));
};

/**
 * Get transactions history by selected accounts
 * @returns {Function}
 */
const getFilteredHistory = async (filter, offset = 0, count = DEFAULT_HISTORY_COUNT) => {
	const selectedAccounts = filter.get('accounts')
		.filter((a) => a.get('selected'))
		.reduce((arr, a) => ([...arr, a.get('id')]), []);
	const assets = filter.get('coins')
		.filter((c) => (c.get('type') === ASSET_TYPE && c.get('selected')))
		.reduce((arr, c) => [...arr, c.getIn(['asset', 'id'])], []);
	const tokens = filter.get('coins')
		.filter((c) => (c.get('type') === TOKEN_TYPE && c.get('selected')))
		.reduce((arr, c) => [...arr, c.getIn(['contract', 'id'])], []);
	const operations = filter.get('types')
		.filter((o) => o.get('selected'))
		.reduce((arr, o) => [...arr, o.get('type').toUpperCase()], []);

	const { items, total } = await getHistoryByAccounts(
		selectedAccounts,
		assets,
		tokens,
		operations,
		offset,
		count,
	);

	let transactions = items.map(({
		id, body, transaction, result, virtual, block,
	}) => formatTransaction(
		Number(id),
		fromJS(body),
		virtual ? block.round : transaction.block.round,
		result,
		selectedAccounts,
	));
	transactions = await Promise.all(transactions);

	return { transactions: fromJS(transactions), total };
};

/**
 * Save filters in db
 * @returns {Function}
 */
const saveHistoryFilter = (filter) => {
	const localStorage = Services.getLocalStorage();
	localStorage.setData('historyFilter', filter);
};

/**
 * Set default history filters
 * @returns {Function}
 */
export const setDefaultFilters = () => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts');
	let filter = getState().wallet.getIn(['history', 'filter']);

	filter = filter.set('accounts', accounts.map((a, id) => a.set('id', id).set('selected', true)).toList());

	accounts = accounts.reduce((arr, name, id) => ([...arr, id]), []);

	let coins = await getCoinsByAccounts(accounts);
	coins = coins.reduce((arr, c) => {
		if (c.type === ASSET_TYPE && arr.find((i) => i.asset && i.asset.id === c.asset.id)) {
			return arr;
		}

		if (c.type === TOKEN_TYPE && arr.find((i) => i.contract && i.contract.id === c.contract.id)) {
			return arr;
		}

		return [...arr, c];
	}, []);

	if (!coins.length) {
		coins.push({
			type: ASSET_TYPE,
			asset: {
				id: ECHO_ASSET_ID,
				symbol: ECHO_ASSET_SYMBOL,
				precision: ECHO_ASSET_PRECISION,
			},
			contract: null,
		});
	}

	coins = coins.map((i) => ({ ...i, selected: true }));
	filter = filter.set('coins', fromJS(coins));

	filter = filter.set('types', fromJS(Object.keys(OPERATIONS).map((type) => ({
		type,
		name: OPERATIONS[type].name,
		selected: true,
	}))));

	dispatch(setIn('history', { filter }));
	saveHistoryFilter(filter);
};

/**
 * Update history filters
 * @returns {Function}
 */
const updateFilters = (filter) => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts');

	const newAccounts = accounts
		.filter((a, id) => !filter.get('accounts').find((acc) => acc.get('id') === id))
		.map((a, id) => a.set('id', id).set('selected', true))
		.toList();

	if (newAccounts.size) {
		filter = filter.set('accounts', filter.get('accounts').concat(newAccounts));
	}

	filter = filter.set('accounts', filter.get('accounts').filter((a) => accounts.has(a.get('id'))));

	accounts = accounts.reduce((arr, name, id) => ([...arr, id]), []);

	let coins = await getCoinsByAccounts(accounts);
	coins = coins.reduce((arr, c) => {
		if (c.type === ASSET_TYPE && arr.find((i) => i.asset && i.asset.id === c.asset.id)) {
			return arr;
		}

		if (c.type === TOKEN_TYPE && arr.find((i) => i.contract && i.contract.id === c.contract.id)) {
			return arr;
		}

		return [...arr, c];
	}, []);

	if (!coins.length) {
		coins.push({
			type: ASSET_TYPE,
			asset: {
				id: ECHO_ASSET_ID,
				symbol: ECHO_ASSET_SYMBOL,
				precision: ECHO_ASSET_PRECISION,
			},
			contract: null,
		});
	}

	const newCoins = fromJS(coins)
		.filter((coin) => !filter.get('coins').find((c) => (
			c.get('type') === coin.get('type') && c.getIn(['asset', 'id']) === coin.getIn(['asset', 'id']) && c.getIn(['contract', 'id']) === coin.getIn(['contract', 'id'])
		)))
		.map((i) => i.set('selected', true));

	if (newCoins.size) {
		filter = filter.set('coins', filter.get('coins').concat(fromJS(newCoins)));
	}

	filter = filter.set('coins', filter.get('coins').filter((coin) => fromJS(coins).find((c) => (
		c.get('type') === coin.get('type') && c.getIn(['asset', 'id']) === coin.getIn(['asset', 'id']) && c.getIn(['contract', 'id']) === coin.getIn(['contract', 'id'])
	))));

	dispatch(setIn('history', { filter }));
	saveHistoryFilter(filter);
};

/**
 * Load history
 * @returns {Function}
 */
export const loadTransactions = () => async (dispatch, getState) => {
	dispatch(set('loading', true));

	try {
		const accounts = getState().global.get('accounts');

		if (!accounts.size) {
			dispatch(clear('history'));
			return;
		}

		let filter = fromJS(Services.getLocalStorage().getData('historyFilter') || {});

		if (filter.isEmpty() || (!filter.get('accounts') && !filter.get('coins') && !filter.get('types'))) {
			await dispatch(setDefaultFilters());
		} else {
			await dispatch(updateFilters(filter));
		}

		filter = getState().wallet.getIn(['history', 'filter']);
		const [{ transactions, total }] = await Promise.all([
			getFilteredHistory(filter),
			ViewHelper.timeout(),
		]);
		dispatch(setIn('history', { transactions, total }));
	} catch (e) {
		console.warn(e);
	} finally {
		dispatch(set('loading', false));
	}
};

/**
 * Load more transactions
 * @returns {Function}
 */
export const loadMoreTransactions = () => async (dispatch, getState) => {
	const { size } = getState().wallet.getIn(['history', 'transactions']);
	const filter = getState().wallet.getIn(['history', 'filter']);

	const { transactions, total } = await getFilteredHistory(filter, size);
	dispatch(mergeIn('history', { transactions, total }));
};


/**
 * Add new transaction
 * @returns {Function}
 */
export const setNewTransaction = ({
	id, body, transaction, result, virtual, block,
}) => async (dispatch, getState) => {

	const selectedAccounts = getState().wallet.getIn(['history', 'filter', 'accounts'])
		.filter((a) => a.get('selected'))
		.reduce((arr, a) => ([...arr, a.get('id')]), []);

	const operation = await formatTransaction(
		Number(id),
		fromJS(body),
		virtual ? block.round : transaction.block.round,
		result,
		selectedAccounts,
	);

	dispatch(WalletReducer.actions.addOperation({ operation }));
};

/**
 * Get transactions details
 *
 * @param {Number} index
 *
 * @returns {Function}
 */
export const toggleTransactionDetails = (index) => (dispatch) => {
	dispatch(WalletReducer.actions.toggleSelect({ index }));
};

/**
 * Update transactions filter and transactions
 *
 * @param accounts
 * @param coins
 * @param types
 *
 * @returns {Function}
 */
export const saveFilters = (accounts, coins, types) => async (dispatch, getState) => {
	let filter = getState().wallet.getIn(['history', 'filter']);
	filter = filter.set('accounts', accounts);
	filter = filter.set('coins', coins);
	filter = filter.set('types', types);

	dispatch(setIn('history', { filter }));
	saveHistoryFilter(filter);

	dispatch(set('loading', true));

	try {
		const [{ transactions, total }] = await Promise.all([
			getFilteredHistory(filter),
			ViewHelper.timeout(),
		]);
		dispatch(setIn('history', { transactions, total }));
	} catch (e) {
		console.warn(e);
	} finally {
		dispatch(set('loading', false));
	}

};

/**
 * Get transaction fee
 * @returns {Function}
 */
export const getOperationFee = async (type, transaction) => {
	let tr = Services.getEcho().api.createTransaction();
	tr = tr.addOperation(type, transaction);
	tr = await tr.setRequiredFees();

	return tr.operations[0][1].fee.amount;
};
