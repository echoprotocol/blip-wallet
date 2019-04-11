import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../constants/validation-constants';

class ValidatePasswordHelper {

	static passwordHints(password) {
		const hints = {};

		if (!password.length) {
			return {
				hint1: '',
				hint2: '',
				hint3: '',
				hint4: '',
			};
		}
		const reg = new RegExp(`^[\\w+]{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}$`);

		if (password.match(reg)) {
			hints.hint1 = 'active';
		} else {
			hints.hint1 = '';
		}

		// Hint 2
		if (/[A-Z]+/.test(password)) {
			hints.hint2 = 'active';
		} else {
			hints.hint2 = '';
		}

		// Hint 3
		if (/[a-z]+/.test(password)) {
			hints.hint3 = 'active';
		} else {
			hints.hint3 = '';
		}

		// Hint 4
		if (/^(?=.*[0-9])/.test(password)) {
			hints.hint4 = 'active';
		} else {
			hints.hint4 = '';
		}

		return hints;
	}

}

export default ValidatePasswordHelper;
