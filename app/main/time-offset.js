import Sntp from '@hapi/sntp';

class TimeOffset {

	constructor() {
		this.offset = null;
	}

	/**
	 *
	 * @return {Promise.<Number>}
	 */
	async getOffset() {

		if (this.offset) {
			return this.offset;
		}
		const time = await Sntp.time();
		this.offset = time.t;

		return this.offset;
	}

}

export default TimeOffset;
