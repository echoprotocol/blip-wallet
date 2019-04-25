import { validators } from 'echojs-lib';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../constants/global-constants';

class ValidateAccountHelper {

	/**
	 * @method validateAccountName
	 *
	 * Account name validating
	 *
	 * @param {String} accountName
	 */
	static validateAccountName(accountName) {

		if (!accountName) {
			return 'Account name should not be empty';
		}

		if (validators.checkAccountName(accountName)) {
			return validators.checkAccountName(accountName);
		}

		return null;
	}

	/**
	 * @method accountNameHints
	 *
	 * Enable hints highlighting
	 *
	 * @param {String} accountName
	 */
	static accountNameHints(accountName) {
		const hints = {};

		if (accountName.length < NAME_MIN_LENGTH || accountName.length > NAME_MAX_LENGTH) {
			hints.hint1 = '';
		} else if (accountName.length <= NAME_MAX_LENGTH) {
			hints.hint1 = 'active';
		}

		if (!accountName.length) {
			return {
				hint1: '',
				hint2: '',
				hint3: '',
				hint4: '',
			};
		}

		if (!/^[~\w]/.test(accountName)) {
			hints.hint2 = '';
		} else {
			hints.hint2 = 'active';
		}

		if (!/^[~a-z0-9-]*$/.test(accountName)) {
			hints.hint3 = '';
		} else {
			hints.hint3 = 'active';
		}

		if (!/[a-z0-9]$/.test(accountName)) {
			hints.hint4 = '';
		} else {
			hints.hint4 = 'active';
		}

		return hints;
	}

	/**
	 * @method validateWIF
	 *
	 * Validate wif key
	 *
	 * @param {String} wif
	 */
	static validateWIF(wif) {
		if (!wif) { return 'WIF should not be empty'; }

		if (wif.length !== 0 && wif.length < 8) {
			return 'WIF must be 8 characters or more';
		}

		return null;
	}

}

export default ValidateAccountHelper;
