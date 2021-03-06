
class LocalStorageService {

	/**
	 *
	 * @param {String} key
	 * @returns {any}
	 */
	getData(key) {
		const data = JSON.parse(localStorage.getItem(key) || 'null');
		return data;
	}

	/**
	 *
	 * @param {String} key
	 * @param {String} data
	 */
	setData(key, data) {
		localStorage.setItem(key, JSON.stringify(data));
	}

	/**
	 *
	 * @param {String} key
	 */
	removeData(key) {
		localStorage.removeItem(key);
	}

}

export default LocalStorageService;
