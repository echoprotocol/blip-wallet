import { Map, fromJS } from 'immutable';
import { validators } from 'echojs-lib';

import WalletReducer from '../reducers/wallet-reducer';

import {
	OPERATION_ID_PREFIX, OPTION_TYPES, OPERATIONS,
} from '../constants/transaction-constants';
import Services from '../services';

/**
 * Set value by field
 * @param field
 * @param value
 * @returns {Function}
 */
export const set = (field, value) => (dispatch) => {
	dispatch(WalletReducer.actions.set({ field, value }));
};

export const formatTransaction = async (transaction, accountId = undefined) => {
	const [type, operation] = transaction.get('op');
	// const [, result] = transaction.get('result');
	const block = await Services.getEcho().api.getBlock(transaction.get('block_num'));
	const feeAsset = await Services.getEcho().api.getObject(operation.getIn(['fee', 'asset_id']));

	let { name, options } = Object.values(OPERATIONS).find((i) => i.value === type);

	if (type === OPERATIONS.transfer.value) {
		name = operation.get('from') === accountId ? `${name}.sent` : `${name}.received`;
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

	return fromJS({ ...object, ...options, account: accountId });
};

/**
 * Set last transaction by selected accounts
 * @returns {Function}
 */
export const setLastTransaction = () => async (dispatch, getState) => {
	let accounts = getState().global.get('accounts').filter((a) => a.get('selected'));

	if (!accounts.size) {
		dispatch(set('transaction', new Map({})));
		return;
	}

	accounts = accounts.map((name, id) => getState().echoCache.getIn(['fullAccounts', id]));

	const account = accounts.sort((a, b) => {
		a = (a.getIn(['history', '0', 'id']) || OPERATION_ID_PREFIX).slice(OPERATION_ID_PREFIX.length);
		b = (b.getIn(['history', '0', 'id']) || OPERATION_ID_PREFIX).slice(OPERATION_ID_PREFIX.length);
		return Number(a) < Number(b) ? 1 : -1;
	}).first();

	const transaction = await formatTransaction(
		account.getIn(['history', '0']),
		account.get('id'),
		account.get('name'),
	);

	dispatch(set('transaction', transaction));
};
