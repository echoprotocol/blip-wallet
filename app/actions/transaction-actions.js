import { Map, fromJS } from 'immutable';
import { validators, CACHE_MAPS } from 'echojs-lib';

import WalletReducer from '../reducers/wallet-reducer';

import {
	OPERATION_ID_PREFIX, ASSET_TYPE, TOKEN_TYPE, OPERATION_TYPES,
	OPTION_TYPES, OPERATIONS,
} from '../constants/transaction-constants';
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
 *  @method formatTransaction
 *
 *  Format operation
 *
 *  @param {Number} type
 *  @param {Immutable.Map} operation
 *  @param {String} blockNumber
 *  @params {String[]} [accounts]
 */
export const formatTransaction = async (type, operation, blockNumber, accounts = []) => {
	if (!operation.size || !blockNumber) {
		return new Map({});
	}

	// const [type, operation] = transaction.get('op');
	// const [, result] = transaction.get('result');
	const block = await Services.getEcho().api.getBlock(blockNumber);
	const feeAsset = await Services.getEcho().api.getObject(operation.getIn(['fee', 'asset_id']));

	let { name, options } = Object.values(OPERATIONS).find((i) => i.value === type);

	if (type === OPERATIONS.transfer.value) {
		name = accounts.includes(operation.get('from')) ? `${name}.sent` : `${name}.received`;
	}

	const object = {
		name,
		timestamp: block.timestamp,
		fee: {
			amount: operation.getIn(['fee', 'amount']),
			precision: feeAsset.precision,
			symbol: feeAsset.symbol,
		},
	};

	options = Object.entries(options).map(async ([key, value]) => {
		if (!value) { return value; }

		let response;
		const base = { key, type: value.type };
		const field = operation.getIn(value.field.split('.'));

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
			case OPTION_TYPES.ASSET:
				response = await Services.getEcho().api.getObject(field);

				return {
					...base,
					link: `/asset/${response.id}/info`,
					label: value.label,
					value: response.symbol,
					precision: response.precision,
					id: response.id,
				};
			case OPTION_TYPES.STRING:
				return {
					...base,
					label: value.label,
					value: field,
				};
			case OPTION_TYPES.NUMBER:
				return {
					...base,
					label: value.label,
					value: field,
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

	transaction = await formatTransaction(
		transaction.getIn(['op', '0']),
		transaction.getIn(['op', '1']),
		transaction.get('block_num'),
		[account.get('id')],
	);

	dispatch(set('transaction', transaction));
};

/**
 * Get transactions history by selected accounts
 * @returns {Function}
 */
export const getFilteredHistory = () => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts');
	let filter = getState().wallet.getIn(['history', 'filter']);

	if (!accounts.size) {
		dispatch(clear('history'));
		return;
	}

	if (!filter.get('accounts')) {
		filter = filter.set('accounts', accounts.map((a) => a.set('selected', true)).toList());
	}

	accounts = accounts.reduce((arr, name, id) => ([...arr, id]), []);

	if (!filter.get('coins')) {
		let coins = await getCoinsByAccounts(['1.2.177']); //	accounts
		coins = coins.map((i) => ({ ...i, selected: true }));
		filter = filter.set('coins', fromJS(coins));
	}

	if (!filter.get('types')) {
		filter = filter.set('types', fromJS(OPERATION_TYPES.map((type) => ({ type, selected: true }))));
	}

	const selectedAccounts = filter.get('accounts')
		.filter((a) => a.get('selected'))
		.reduce((arr, name, id) => ([...arr, id]), []);
	const assets = filter.get('coins')
		.filter((c) => (c.get('type') === ASSET_TYPE && c.get('selected'))); // TODO: EDIT
	const tokens = filter.get('coins')
		.filter((c) => (c.get('type') === TOKEN_TYPE && c.get('selected')))
		.reduce((arr, c) => [...arr, c.getIn(['contract', 'id'])], []);
	const operations = filter.get('types')
		.filter((o) => o.get('selected'))
		.reduce((arr, o) => [...arr, o.get('type')], []);

	const { items, total } = await getHistoryByAccounts(
		['1.2.177'], //	selectedAccounts
		assets.length ? assets : undefined,
		tokens.length ? tokens : undefined,
		operations.length ? operations : undefined,
	);
	const blockNumber = '1057924'; // TODO: EDIT

	let transactions = items.map(({ id, body }) => formatTransaction(Number(id), fromJS(body), blockNumber, selectedAccounts));
	transactions = await Promise.all(transactions);

	dispatch(set('history', fromJS({ transactions, total, filter })));
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
 * @param {String} filter
 * @param {Number} index
 *
 * @returns {Function}
 */
export const updateFilter = (filter, index) => (dispatch) => {
	dispatch(WalletReducer.actions.toggleFilter({ filter, index }));
	dispatch(getFilteredHistory());
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
