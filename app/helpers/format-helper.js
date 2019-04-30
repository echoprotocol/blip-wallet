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
	 * @param value
	 * @param precision
	 * @returns {string}
	 */
	static toFixed(value, precision) {

		return value.toFixed(precision).toString(10);
	}

	/**
	 * @method formatAmount
	 * @param amount
	 * @param precision
	 * @returns {string}
	 */
	static formatAmount(amount, precision) {
		if (amount === undefined) {
			return '–';
		}

		const number = new BN(amount).div(10 ** precision);

		const base = `${parseInt(this.toFixed(Math.abs(number || 0), precision), 10)}`;
		const mod = base.length > 3 ? base.length % 3 : 0;

		let postfix = `.${this.toFixed(number, precision).split('.')[1]}`;

		for (let i = postfix.length - 1; i >= 0; i -= 1) {
			if (postfix[i] === '0') {
				postfix = postfix.substr(0, postfix.length - 1);
			} else if (postfix[i] === '.') {
				postfix = '';
			} else {
				break;
			}
		}

		return (mod ? `${base.substr(0, mod)} ` : '')
		+ base.substr(mod).replace(/(\d{3})(?=\d)/g, `$1${' '}`)
		+ (precision ? postfix : '');
	}

	/**
	 *
	 * @param {String} date
	 * @param {String} language
	 * @param {String} formatter
	 * @returns {string}
	 */
	static getTransformDate(date, language, formatter) {
		return moment.utc(date).local().locale(language).format(formatter);
	}

	/**
	 *
	 * @param {String} date
	 * @param {String} language
	 * @param {String} formatter
	 * @returns {String}
	 */
	static getLocaleTransformDate(date, language, formatter) {
		let localeFormatter = formatter;
		if (language === 'ru') {
			localeFormatter = localeFormatter.replace('hh', 'HH');
		} else {
			localeFormatter = localeFormatter.replace('HH', 'hh').replace('MMM', 'MMM.');
		}

		let transformDate = FormatHelper.getTransformDate(date, language, localeFormatter);

		if (language !== 'ru') {
			const [ap] = moment.utc(date).format('a').split('');
			transformDate = `${transformDate} ${ap}.m.`;
		}

		return transformDate;
	}

	/**
	 *
	 * @param {String} date
	 * @param {String} language
	 * @param {String} formatter
	 * @returns {String}
	 */
	static getLocaleDateFromNow(date, language, formatter) {
		if (!moment.utc(date).isBefore(moment.utc().subtract(12, 'h'))) {
			return moment.utc(date).local().locale(language).fromNow();
		}

		return FormatHelper.getLocaleTransformDate(date, language, formatter);
	}

}
