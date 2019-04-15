import BN from 'bignumber.js';

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

}
