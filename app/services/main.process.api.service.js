
let ipcRenderer;

try {
	/* eslint-disable global-require */
	const electron = require('electron');
	({ ipcRenderer } = electron);
} catch (e) {
	console.log('Err electron import');
}

class MainProcessAPIService {

	getPlatform() {
		return new Promise((resolve) => {

			if (!ipcRenderer) {
				return resolve(null);
			}

			ipcRenderer.once('getPlatform', (_, platform) => {
				resolve(platform);
			});

			ipcRenderer.send('getPlatform');

			return null;
		});

	}

}


export default MainProcessAPIService;
