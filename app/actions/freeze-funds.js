import BN from 'bignumber.js';
import { CACHE_MAPS, OPERATIONS_IDS } from 'echojs-lib';

import {
	setFormError, setFormValue, setValue,
} from './form-actions';

import {
	checkFeePool, getTransactionFee, sendTransaction,
} from './transaction-actions';

import ValidateSendHelper from '../helpers/validate-send-helper';
import FormatHelper from '../helpers/format-helper';

import {
	BROADCAST_LIMIT,
	ECHO_ASSET_ID,
	FREEZE_FUNDS_PERIODS,
} from '../constants/global-constants';
import { FORM_FREEZE } from '../constants/form-constants';
import { WALLET } from '../constants/routes-constants';

import GlobalReducer from '../reducers/global-reducer';
import { history } from '../store/configureStore';
import Services from '../services';

export const changeAccount = (fromId) => (dispatch) => {
	dispatch(setFormValue(FORM_FREEZE, 'from', fromId));
	dispatch(setFormError(FORM_FREEZE, 'fee', ''));
	dispatch(setFormError(FORM_FREEZE, 'amount', ''));
};

/**
 *  @method setFeeFormValue
 *
 * 	Set fee depending on the amount value and memo
 */
export const setFeeFormValue = () => async (dispatch, getState) => {
	try {
		const form = getState().form.get(FORM_FREEZE);

		const amount = new BN(form.get('amount').value);
		const objectsById = getState().echoCache.get(CACHE_MAPS.OBJECTS_BY_ID);

		let defaultSelected = objectsById
			.filter((o, id) => ValidateSendHelper.isAccountBalanceId(id))
			.find((val) => val.get('asset_type') === ECHO_ASSET_ID);
		defaultSelected = defaultSelected ? defaultSelected.get('id') : '';

		const selectedBalance = defaultSelected;
		const selectedFeeBalance = getState().form.getIn([FORM_FREEZE, 'selectedFeeBalance']) || defaultSelected;

		const accounts = getState().global.getIn(['accounts']);

		const fromId = accounts.findKey((a, id) => id === form.get('from').value)
			|| accounts.findKey((a, id) => id === form.get('initialData').accountId) || [...accounts.keys()][0];

		const duration = form.get('duration') || FREEZE_FUNDS_PERIODS[0].value;

		const asset = selectedBalance
			? objectsById.get(objectsById.getIn([selectedBalance, 'asset_type']))
			: objectsById.get(ECHO_ASSET_ID);

		const type = OPERATIONS_IDS.BALANCE_FREEZE;

		const options = {
			amount: {
				amount: new BN(amount).times(10 ** asset.get('precision')).toString(10),
				asset_id: asset.get('id'),
			},
			fee: {
				asset_id: objectsById.getIn([selectedFeeBalance, 'asset_type']) || asset.get('id'),
			},
			duration,
			account: fromId,
		};

		if (!options.amount.asset_id || !options.fee.asset_id || !options.account) {
			return false;
		}

		const resultFee = await dispatch(getTransactionFee(type, options, FORM_FREEZE));

		if (!resultFee) {
			return false;
		}

		const precision = objectsById.getIn([options.fee.asset_id, 'precision']);

		const value = new BN(resultFee.amount).div(new BN(10).pow(precision)).toFixed(precision);
		dispatch(setFormValue(FORM_FREEZE, 'fee', value));
	} catch (err) {
		console.warn(err);

		dispatch(setFormError(FORM_FREEZE, 'fee', 'Fee is not calculated'));
	}

	return true;
};

/**
 *  @method freezeFunds
 *
 * 	Transfer transaction
 */
export const freezeFunds = () => async (dispatch, getState) => {
	const form = getState().form.get(FORM_FREEZE);

	const amount = new BN(form.get('amount').value).toString();

	const fee = form.get('fee');

	if (form.get('amount').error || fee.error || !form.get('duration')) {
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

	const selectedBalance = defaultSelected;
	const selectedFeeBalance = getState().form.getIn([FORM_FREEZE, 'selectedFeeBalance']) || defaultSelected;
	const selectedDuration = getState().form.getIn([FORM_FREEZE, 'duration']) || FREEZE_FUNDS_PERIODS[0].value;

	if (!selectedBalance || !selectedFeeBalance) {
		dispatch(setFormError(FORM_FREEZE, 'amount', 'Insufficient funds'));

		return false;
	}

	const balance = {
		symbol: objectsById.getIn([objectsById.getIn([selectedBalance, 'asset_type']), 'symbol']),
		precision: objectsById.getIn([objectsById.getIn([selectedBalance, 'asset_type']), 'precision']),
		balance: objectsById.getIn([selectedBalance, 'balance']),
	};

	const amountError = ValidateSendHelper.validateAmount(amount, balance);

	if (amountError) {
		dispatch(setFormError(FORM_FREEZE, 'amount', amountError));
		return false;
	}

	dispatch(GlobalReducer.actions.set({ field: 'loading', value: 'freeze_funds.loading' }));

	try {
		const assetId = objectsById.getIn([selectedBalance, 'asset_type']) || ECHO_ASSET_ID;
		const assetIdFee = objectsById.getIn([selectedFeeBalance, 'asset_type']) || ECHO_ASSET_ID;
		const duration = selectedDuration;

		const type = OPERATIONS_IDS.BALANCE_FREEZE;
		const options = {
			amount: {
				amount: parseFloat(amount),
				asset_id: assetId,
			},
			fee: {
				asset_id: assetIdFee,
			},
			account: fromAccount.id,
			duration,
		};

		if (fee.value) {
			options.fee.amount = fee.value;
		}

		if (!options.fee.amount) {
			options.fee = await dispatch(getTransactionFee(type, options, FORM_FREEZE));

			if (!options.fee) {
				return false;
			}
		}

		const feeAsset = objectsById.get(options.fee.asset_id);

		if (!checkFeePool(objectsById.get(ECHO_ASSET_ID), feeAsset, options.fee.amount)) {
			dispatch(setFormError(
				FORM_FREEZE,
				'fee',
				`${feeAsset.get('symbol')} fee pool balance is less than fee amount`,
			));
			return false;
		}

		const feePrecision = new BN(10).pow(feeAsset.get('precision'));
		const feeAmount = new BN(options.fee.amount).times(feePrecision);

		if (options.amount.asset_id === options.fee.asset_id) {
			const totalAmount = new BN(amount).times(feePrecision).plus(feeAmount);

			if (totalAmount.gt(objectsById.getIn([selectedBalance, 'balance']))) {
				dispatch(setFormError(FORM_FREEZE, 'fee', 'Insufficient funds for fee'));
				return false;
			}
		}

		const feeAssetPrecision = new BN(10).pow(feeAsset.get('precision'));

		const amountAsset = objectsById.get(options.amount.asset_id);
		options.amount.amount = new BN(options.amount.amount).times(new BN(10).pow(amountAsset.get('precision'))).toString();
		options.fee.amount = new BN(options.fee.amount).times(feeAssetPrecision).toString();

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
		console.warn('Broadcast transaction error', FormatHelper.getError(err));

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

	const selectedBalance = defaultSelected;

	let asset = null;
	let symbol = '';
	let precision = null;

	if (!selectedBalance) {
		asset = await Services.getEcho().api.getObject(ECHO_ASSET_ID);
		({ symbol } = asset);
		({ precision } = asset);

		dispatch(setValue(FORM_FREEZE, 'echoAsset', { symbol, precision }));
	} else {
		asset = objectsById.get(selectedBalance.get('asset_type'));
		symbol = asset.get('symbol');
		precision = asset.get('precision');
	}

	const amount = new BN(1).div(10 ** precision).toFixed(precision);

	dispatch(setValue(FORM_FREEZE, 'minAmount', { amount, symbol }));

	return true;
};
