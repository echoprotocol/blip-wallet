import BN from 'bignumber.js';
import moment from 'moment';

export default class FormatHelper {

	/**
     *
     * @param {Array} values
     * @returns {Object}
     */
	static accumulateBalances(values) {
		return values.reduce((res, a) => res.plus(a), new BN(0));
	}

	/**
	 *
	 * @param string
	 * @returns {String}
	 */
	static capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	/**
	 *
	 * @param string date
	 * @param string language
	 * @param string formatter
	 * @returns {String}
	 */
	static transformDate(date, language, formatter) {
		return moment.utc(date).local().locale(language).format(formatter);
	}

}
