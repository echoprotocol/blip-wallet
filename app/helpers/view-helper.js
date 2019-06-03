import { TIME_LOADING } from '../constants/global-constants';

export default class ViewHelper {

	/**
	 * @param ms
	 * @returns {Promise}
	 */
	static timeout(ms = TIME_LOADING) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

}
