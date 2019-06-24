import BN from 'bignumber.js';
import { keccak256 } from 'js-sha3';
import { CACHE_MAPS, OPERATIONS_IDS } from 'echojs-lib';

import { FORM_SEND } from '../constants/form-constants';
import ValidateSendHelper from '../helpers/validate-send-helper';
import {
	setFormError, setFormValue, setValue,
} from './form-actions';
import Services from '../services';
import GlobalReducer from '../reducers/global-reducer';
import {
	BROADCAST_LIMIT,
	ECHO_ASSET_ID,
	EXPIRATION_INFELICITY,
	GLOBAL_ID_1,
} from '../constants/global-constants';
import { TRANSFER_KEYS } from '../constants/transaction-constants';
import { getOperationFee } from './transaction-actions';
import { signTransaction } from './sign-actions';
import { WALLET } from '../constants/routes-constants';
import { history } from '../store/configureStore';

const getTransferCode = (id, amount) => {
	const method = keccak256('transfer(address,uint256)').substr(0, 8);

	const idArg = Number(id.split('.')[2]).toString(16).padStart(64, '0');

	const amountArg = amount.toString(16).padStart(64, '0');

	return method + idArg + amountArg;
};

/**
 *  @method checkAccount
 *
 * 	Look up accounts
 *
 * 	@param {String} fromAccount
 * 	@param {String} toAccount
 */
export const checkAccount = (fromAccount, toAccount) => async (dispatch) => {
	try {
		if (fromAccount === toAccount) {
			dispatch(setFormError(FORM_SEND, 'to', 'You can not send funds to yourself'));
			return false;
		}

		const result = await Services.getEcho().api.lookupAccounts(toAccount);

		if (!result.find((i) => i[0] === toAccount)) {
			dispatch(setFormError(FORM_SEND, 'to', 'Account is not found'));
			return false;
		}
	} catch (err) {
		dispatch(setFormError(FORM_SEND, 'to', err.message || err));

		return false;
	} finally {
		dispatch(setValue(FORM_SEND, 'isCheckLoading', false));
	}

	dispatch(setFormError(FORM_SEND, 'to', ''));
	return true;
};

/**
 *  @method checkFeePool
 *
 * 	Remove balances and assets by deleted user's id
 *
 * 	@param {Object} coreAsset
 * 	@param {Object} asset
 * 	@param {Number} fee
 */
const checkFeePool = (coreAsset, asset, fee) => {
	if (coreAsset.get('id') === asset.get('id')) { return true; }

	let feePool = new BN(asset.getIn(['dynamic', 'fee_pool'])).div(10 ** coreAsset.get('precision'));

	const base = asset.getIn(['options', 'core_exchange_rate', 'base']);
	const quote = asset.getIn(['options', 'core_exchange_rate', 'quote']);
	const precision = coreAsset.get('precision') - asset.get('precision');
	const price = new BN(quote.get('amount')).div(base.get('amount')).times(10 ** precision);
	feePool = price.times(feePool).times(10 ** asset.get('precision'));

	return feePool.gt(fee);
};

/**
 *  @method getTransactionFee
 *
 * 	Get operation fee
 *
 * 	@param type
 * 	@param {Object} options
 */
const getTransactionFee = (type, options) => async (dispatch) => {

	try {
		const { fee } = options;
		const core = await Services.getEcho().api.getObject(ECHO_ASSET_ID);
		const feeAsset = await Services.getEcho().api.getObject(fee.asset_id);

		let amount = await getOperationFee(type, options);

		if (feeAsset.id !== ECHO_ASSET_ID) {
			const price = new BN(feeAsset.options.core_exchange_rate.quote.amount)
				.div(feeAsset.options.core_exchange_rate.base.amount)
				.times(10 ** (core.precision - feeAsset.precision));

			amount = new BN(amount).div(10 ** core.precision);
			amount = price.times(amount).times(10 ** feeAsset.precision);
		}

		return {
			amount: new BN(amount).integerValue(BN.ROUND_UP).toString(),
			asset_id: fee.asset_id,
		};
	} catch (err) {
		dispatch(setFormError(FORM_SEND, 'fee', 'Can\'t be calculated'));
	}


	return null;
};

/**
 *  @method setFeeFormValue
 *
 * 	Set fee depending on the amount value and memo
 */
export const setFeeFormValue = () => async (dispatch, getState) => {
	try {
		const form = getState().form.get(FORM_SEND);

		const to = form.get('to');

		const result = await Services.getEcho().api.lookupAccounts(to.value);

		if (!result.find((i) => i[0] === to.value)) {
			return false;
		}

		const amount = Number(form.get('amount').value).toString();
		const objectsById = getState().echoCache.get(CACHE_MAPS.OBJECTS_BY_ID);

		const defaultSelected = objectsById
			.filter((o, id) => ValidateSendHelper.isAccountBalanceId(id))
			.find((val) => val.get('asset_type') === ECHO_ASSET_ID)
			.get('id');

		const selectedBalance = getState().form.getIn([FORM_SEND, 'selectedBalance']) || defaultSelected;
		const selectedFeeBalance = getState().form.getIn([FORM_SEND, 'selectedFeeBalance']) || defaultSelected;

		const accounts = getState().global.getIn(['accounts']);

		const fromId = accounts.findKey((a, id) => id === form.get('from').value)
			|| accounts.findKey((a, id) => id === form.get('initialData').accountId) || [...accounts.keys()][0];
		const [toAccount] = await Services.getEcho().api.getFullAccounts([to.value]);

		let isToken = false;

		if (!ValidateSendHelper.validateContractId(selectedBalance)) {
			isToken = true;
		}

		let options = {};
		let type = null;

		if (!isToken) {
			const amountAsset = objectsById.get(objectsById.getIn([selectedBalance, 'asset_type']));
			type = 'transfer';

			options = {
				amount: {
					amount: new BN(amount).times(10 ** amountAsset.get('precision')).toString(),
					asset_id: amountAsset.get('id'),
				},
				fee: {
					asset_id: objectsById.getIn([selectedFeeBalance, 'asset_type']),
				},
				from: fromId,
				to: toAccount.id,
			};

			if (!options.amount.asset_id || !options.fee.asset_id || !options.from) {
				return false;
			}
		} else {
			const tokens = getState().wallet.get('tokens');
			const precision = tokens.find((t) => t.getIn(['contract', 'id']) === selectedBalance).getIn(['contract', 'token', 'decimals']);
			const code = getTransferCode(toAccount.id, new BN(amount).times(10 ** precision));
			type = OPERATIONS_IDS.CALL_CONTRACT;
			options = {
				code,
				fee: {
					asset_id: objectsById.getIn([selectedFeeBalance, 'asset_type']),
				},
				callee: selectedBalance,
				registrar: fromId,
				value: {
					amount: 0,
					asset_id: objectsById.getIn([selectedFeeBalance, 'asset_type']),
				},
			};

			if (!options.value.asset_id || !options.fee.asset_id || !options.registrar) {
				return false;
			}
		}

		const resultFee = await dispatch(getTransactionFee(type, options));

		if (!resultFee) {
			return false;
		}

		const precision = objectsById.getIn([options.fee.asset_id, 'precision']);
		dispatch(setFormValue(FORM_SEND, 'fee', BN(resultFee.amount).div(BN(10).pow(precision)).toFixed(precision)));
	} catch (err) {
		console.warn(err);

		dispatch(setFormError(FORM_SEND, 'fee', 'Fee is not calculated'));
	}

	return true;
};

/**
 *  @method sendTransaction
 *
 *    Send transaction
 *
 * @param type
 * @param options
 */
const sendTransaction = async (type, options) => {
	const accountId = options[TRANSFER_KEYS[type]];
	const account = await Services.getEcho().api.getObject(accountId);

	let tr = Services.getEcho().api.createTransaction();

	tr = tr.addOperation(type, options);

	const dynamicGlobalChainData = await Services.getEcho().api.getObject(GLOBAL_ID_1, true);

	const headBlockTimeSeconds = Math.ceil(new Date(`${dynamicGlobalChainData.time}Z`).getTime() / 1000);

	tr.expiration = headBlockTimeSeconds + EXPIRATION_INFELICITY;

	await signTransaction(account, tr);

	return tr.broadcast();
};

/**
 *  @method send
 *
 * 	Transfer transaction
 */
export const send = () => async (dispatch, getState) => {

	const form = getState().form.get(FORM_SEND);

	const amount = new BN(form.get('amount').value).toString();

	const to = form.get('to');
	const fee = form.get('fee');

	if (to.error || form.get('amount').error || fee.error) {
		return false;
	}

	const accounts = getState().global.getIn(['accounts']);

	const from = form.get('from');
	const initialFrom = form.get('initialData').accountId;

	const activeAccount = accounts.findKey((a) => a.get('primary'));
	const fromName = from.value || initialFrom || accounts.get(activeAccount).get('name');

	const fromId = accounts.findKey((a, id) => id === from.value) || accounts.findKey((a, id) => id === initialFrom) || activeAccount;

	const [fromAccount] = await Services.getEcho().api.getFullAccounts([fromName]);

	const objectIds = Object.entries(fromAccount.balances).reduce((arr, b) => [...arr, ...b], []);

	await Services.getEcho().api.getObjects(objectIds);

	const objectsById = getState().echoCache.get(CACHE_MAPS.OBJECTS_BY_ID);

	let defaultSelected = objectsById
		.filter((o, id) => ValidateSendHelper.isAccountBalanceId(id))
		.find((val) => val.get('asset_type') === ECHO_ASSET_ID && val.get('owner') === fromId);

	defaultSelected = defaultSelected && defaultSelected.get('id');

	const selectedBalance = getState().form.getIn([FORM_SEND, 'selectedBalance']) || defaultSelected;
	const selectedFeeBalance = getState().form.getIn([FORM_SEND, 'selectedFeeBalance']) || defaultSelected;

	if (!selectedBalance || !selectedFeeBalance) {
		dispatch(setFormError(FORM_SEND, 'amount', 'Insufficient funds'));

		return false;
	}

	let isToken = false;

	if (!ValidateSendHelper.validateContractId(selectedBalance)) {
		isToken = true;
	}

	const tokens = getState().wallet.get('tokens');

	const token = tokens.find((t) => t.getIn(['account', 'id']) === fromId && t.getIn(['contract', 'id']) === selectedBalance);
	const balance = isToken
		? {
			symbol: token.getIn(['contract', 'token', 'symbol']),
			precision: token.getIn(['contract', 'token', 'decimals']),
			balance: token.get('amount'),
		}
		: {
			symbol: objectsById.getIn([objectsById.getIn([selectedBalance, 'asset_type']), 'symbol']),
			precision: objectsById.getIn([objectsById.getIn([selectedBalance, 'asset_type']), 'precision']),
			balance: objectsById.getIn([selectedBalance, 'balance']),
		};

	const amountError = ValidateSendHelper.validateAmount(amount, balance);

	if (amountError) {
		dispatch(setFormError(FORM_SEND, 'amount', amountError));
		return false;
	}

	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'send.loading' }));

	try {

		const isAccount = await dispatch(checkAccount(fromName, to.value));

		if (!isAccount) {
			return false;
		}

		const [toAccount] = await Services.getEcho().api.getFullAccounts([to.value]);

		let options = {};

		const assetId = objectsById.getIn([selectedBalance, 'asset_type']) || ECHO_ASSET_ID;
		const assetIdFee = objectsById.getIn([selectedFeeBalance, 'asset_type']) || ECHO_ASSET_ID;

		let type = null;
		if (isToken) {
			const code = getTransferCode(toAccount.id, new BN(amount).times(10 ** balance.precision));

			type = OPERATIONS_IDS.CALL_CONTRACT;
			options = {
				code,
				fee: {
					amount: fee.value || 0,
					asset_id: assetIdFee,
				},
				callee: selectedBalance,
				registrar: fromAccount.id,
				value: {
					asset_id: assetIdFee,
					amount: 0,
				},
			};
		} else {

			type = 'transfer';
			options = {
				amount: {
					amount: parseFloat(amount),
					asset_id: assetId,
				},
				fee: {
					asset_id: assetIdFee,
				},
				from: fromAccount.id,
				to: toAccount.id,
			};

			if (fee.value) {
				options.fee.amount = fee.value;
			}
		}

		if (!options.fee.amount) {
			options.fee = await dispatch(getTransactionFee(type, options));

			if (!options.fee) {
				return false;
			}
		}

		const feeAsset = objectsById.get(options.fee.asset_id);

		if (!checkFeePool(objectsById.get(ECHO_ASSET_ID), feeAsset, options.fee.amount)) {
			dispatch(setFormError(
				FORM_SEND,
				'fee',
				`${feeAsset.get('symbol')} fee pool balance is less than fee amount`,
			));
			return false;
		}

		if (!isToken) {
			const amountAsset = objectsById.get(options.amount.asset_id);

			if (amountAsset.get('id') === feeAsset.get('id')) {
				const total = new BN(amount).times(10 ** amountAsset.get('precision')).plus(options.fee.amount);

				if (total.gt(objectsById.getIn([selectedBalance, 'balance']))) {
					dispatch(setFormError(FORM_SEND, 'amount', 'Insufficient funds for fee'));
					return false;
				}
			} else {
				const feeBalance = objectsById
					.filter((o, id) => ValidateSendHelper.isAccountBalanceId(id))
					.find((val) => val.get('asset_type') === feeAsset.get('id'))
					.get('balance');

				if (new BN(fee.value).gt(feeBalance)) {
					dispatch(setFormError(FORM_SEND, 'amount', 'Insufficient funds for fee'));
					return false;
				}
			}
		}

		if (isToken) {
			options.value.amount = 0;
			options.fee.amount *= 10 ** feeAsset.get('precision');
		} else {
			const amountAsset = objectsById.get(options.amount.asset_id);
			options.amount.amount = parseInt(options.amount.amount * (10 ** amountAsset.get('precision')), 10);
			options.fee.amount *= 10 ** feeAsset.get('precision');
		}

		const start = new Date().getTime();

		await Promise.race([
			sendTransaction(type, options)
				.then(() => {}, (err) => {
					console.warn('Broadcast transaction error', err);
				}).finally(() => new Date().getTime() - start),
			new Promise((resolve, reject) => {
				const timeoutId = setTimeout(() => {
					clearTimeout(timeoutId);
					reject(new Error('Send transaction timeout'));
				}, BROADCAST_LIMIT);
			}),
		]);

		history.push(WALLET);
	} catch (err) {
		console.warn('Broadcast transaction error', err);

		return null;
	} finally {
		dispatch(GlobalReducer.actions.set({ field: 'loading', value: '' }));
	}

	return null;
};

export const setMinAmount = () => async (dispatch, getState) => {
	const objectsById = getState().echoCache.get(CACHE_MAPS.OBJECTS_BY_ID);

	const defaultSelected = objectsById
		.filter((o, id) => ValidateSendHelper.isAccountBalanceId(id))
		.find((val) => val.get('asset_type') === ECHO_ASSET_ID);

	const selectedBalance = objectsById.get(getState().form.getIn([FORM_SEND, 'selectedBalance'])) || defaultSelected;

	let asset = null;
	let symbol = '';
	let precision = null;

	if (!selectedBalance) {
		asset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);
		({ symbol } = asset);
		({ precision } = asset);

		dispatch(setValue(FORM_SEND, 'echoAsset', { symbol, precision }));
	} else {
		asset = objectsById.get(selectedBalance.get('asset_type'));
		symbol = asset.get('symbol');
		precision = asset.get('precision');
	}

	const amount = new BN(1).div(10 ** precision).toFixed(precision);

	dispatch(setValue(FORM_SEND, 'minAmount', { amount, symbol }));

	return true;
};
