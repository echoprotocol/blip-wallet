
class LocalStorageService {

	/**
	 *
	 * @param {String} key
	 * @returns {any}
	 */
	getData(key) {
		const data = JSON.parse(localStorage.getItem(key) || '{}');
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

}

export default LocalStorageService;
