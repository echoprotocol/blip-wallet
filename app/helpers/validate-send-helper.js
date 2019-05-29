import BN from 'bignumber.js';
import { CONTRACT_ID_PREFIX } from '../constants/global-constants';

export default class ValidateSendHelper {

	static validateContractId(id) {

		id = id.split('.');

		if (id.length !== 3 || parseInt(id[2], 10).toString() !== id[2] || id.splice(0, 2).join('.') !== CONTRACT_ID_PREFIX) {
			return 'Invalid contract ID';
		}

		return null;
	}

	static isAccountBalanceId(v) {
		const accountBalanceIdRegex = /^2\.5\.[1-9]\d*$/;

		return typeof v === 'string' && accountBalanceIdRegex.test(v);
	}

	static amountInput(value, asset) {
		const result = { value: null, error: '', warning: false };

		if (!value.match(/^$|^[0-9]+[.,]?[0-9]*$/)) {
			result.error = 'Amount must contain only digits and dot';
			result.warning = true;
			return result;
		}

		if (/\.|,/.test(value)) {
			const [intPath, doublePath] = value.split(/\.|,/);

			if (doublePath.toString().length === asset.precision && !Math.floor(value.replace(',', '.') * (10 ** asset.precision))) {
				result.error = `Amount should be more than 0 (${asset.symbol} precision is ${asset.precision} symbols)`;

				return result;
			}

			if (doublePath.toString().length > asset.precision) {
				result.error = `${asset.symbol} precision is ${asset.precision}`;
				result.warning = true;

				return result;
			}

			result.value = `${intPath ? Number(intPath) : ''}.${doublePath || ''}`;

			return result;
		}
		result.value = value ? value.toString() : value;


		return result;
	}

	static validateAmount(value, { symbol, precision, balance }) {

		if (!precision || !symbol || !balance) {
			return 'Insufficient funds';
		}

		if (!Math.floor(value * (10 ** precision))) {
			return `Amount should be more than 0 (${symbol} precision is ${precision} symbols)`;
		}

		const amount = new BN(value).times(10 ** precision);

		if (!amount.isInteger()) {
			return `${symbol} precision is ${precision} symbols`;
		}

		if (new BN(value).times(10 ** precision).gt(balance)) {
			return 'Insufficient funds';
		}

		return null;
	}

}
