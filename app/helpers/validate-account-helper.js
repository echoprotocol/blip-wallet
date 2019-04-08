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

		if (accountName.length < NAME_MIN_LENGTH) {
			hints.hint1 = '';
		} else if (accountName.length <= NAME_MAX_LENGTH) {
			hints.hint1 = 'active';
		} else {
			hints.hint1 = 'error';
		}

		if (!accountName.length) {
			return {
				hint1: '',
				hint2: '',
				hint3: '',
			};
		}

		if (!/^[~a-z]/.test(accountName)) {
			hints.hint2 = 'error';
		} else {
			hints.hint2 = 'active';
		}

		if (!/^[~a-z0-9-]*$/.test(accountName)) {
			hints.hint3 = 'error';
		} else {
			hints.hint3 = 'active';
		}

		return hints;
	}

}

export default ValidateAccountHelper;
