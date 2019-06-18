/* eslint global-require: off */
/* eslint-disable no-underscore-dangle */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import {
	app, BrowserWindow, shell, ipcMain, Tray, Menu,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import getPort from 'get-port';
import log from 'electron-log';
import appRootDir from 'app-root-dir';
import notifier from 'node-notifier';
import { join as joinPath, dirname } from 'path';
import rimraf from 'rimraf';
import i18next from 'i18next';

import TimeOffset from './main/time-offset';
import MenuBuilder from './menu';
import EchoNode from './main/echo-node';
import getPlatform from './main/get-platform';

import {
	DATA_DIR,
	// SEED_NODE,
	RESTART_PAUSE_MS,
	CHAIN_MIN_RANGE_PORT,
	CHAIN_MAX_RANGE_PORT,
} from './constants/chain-constants';

import {
	APP_WINDOW_HEIGHT,
	APP_WINDOW_WIDTH,
	APP_WINDOW_MIN_HEIGHT,
	APP_WINDOW_MIN_WIDTH,
	TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS,
	NETWORKS,
	DEFAULT_NETWORK_ID,
	LOCAL_NODE,
} from './constants/global-constants';
import { WIN_PLATFORM } from './constants/platform-constants';
import EN_TRANSLATION from './translations/en';

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=8096');


export default class AppUpdater {

	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}

}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

if (
	process.env.NODE_ENV === 'development'
	|| process.env.DEBUG_PROD === 'true'
) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

	return Promise.all(
		extensions.map((name) => installer.default(installer[name], forceDownload)),
	).catch(console.log);
};

// lock multiple app windows
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', () => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}

			mainWindow.focus();
		}
	});
}

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

const echoNode = new EchoNode();
let restartTimer = null;

app.on('before-quit', (event) => {

	if (restartTimer) {
		clearTimeout(restartTimer);
		restartTimer = null;
	}

	console.log('Caught before-quit. Exiting in 5 seconds.');

	event.preventDefault();

	if (echoNode.child) {
		echoNode.child.then(() => {
			process.exit(0);
		}).catch(() => {
			process.exit(0);
		});

		echoNode.stop();

		setTimeout(() => { process.exit(0); }, TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS);

	} else {
		process.exit(0);
	}

});

let tray = null;

app.on('ready', async () => {

	const timeOffset = new TimeOffset();

	ipcMain.on('getTimeOffset', async (event) => {
		try {
			const offset = await timeOffset.getOffset();
			event.sender.send('getTimeOffset', { result: offset });
		} catch (e) {
			event.sender.send('getTimeOffset', { error: e });
		}
	});

	const execPath = process.env.NODE_ENV === 'production' ? joinPath(dirname(appRootDir.get()), 'icons') : joinPath(appRootDir.get(), 'resources', 'icons');

	tray = new Tray(`${execPath}/128x128.png`);

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Show App',
			click: () => {
				mainWindow.show();
			},
		},
		{
			label: 'Quit',
			click: () => {
				app.isQuiting = true;
				app.quit();
			},
		},
	]);

	tray.setToolTip('This is my application.');
	tray.setContextMenu(contextMenu);

	if (
		process.env.NODE_ENV === 'development'
		|| process.env.DEBUG_PROD === 'true'
	) {
		await installExtensions();
	}

	await i18next.init({
		lng: 'en',
		debug: true,
		resources: {
			en: {
				translation: EN_TRANSLATION,
			},
		},
	});

	mainWindow = new BrowserWindow({
		show: false,
		width: APP_WINDOW_WIDTH,
		height: APP_WINDOW_HEIGHT,
		minWidth: APP_WINDOW_MIN_WIDTH,
		minHeight: APP_WINDOW_MIN_HEIGHT,
		backgroundColor: '#6852A4',
		frame: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	mainWindow.loadURL(`file://${__dirname}/app.html`);

	let rendererIsReady = false;
	let port = null;

	function sendPort() {
		if (port && rendererIsReady) {
			mainWindow.webContents.send('port', port);
		}
	}

	ipcMain.on('subscribePort', async () => {
		rendererIsReady = true;
		sendPort();
	});

	ipcMain.on('getPlatform', async () => {
		mainWindow.webContents.send('getPlatform', getPlatform());
	});

	let localEchoNodeNotified = false;

	ipcMain.on('setLanguage', async () => {

		// TODO:: language switch

		if (!localEchoNodeNotified) {
			if (getPlatform() === WIN_PLATFORM) {
				notifier.notify({
					title: i18next.t('notifications.title'),
					message: i18next.t('notifications.windows_doesnt_support_local_node'),
				});
			} else {
				notifier.notify({
					title: i18next.t('notifications.title'),
					message: i18next.t('notifications.consensus_message'),
				});
			}

			localEchoNodeNotified = true;

		}

	});

	// @TODO: Use 'ready-to-show' event
	//        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
	mainWindow.webContents.on('did-finish-load', async () => {

		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}

		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.focus();
		}

		port = await getPort({ port: getPort.makeRange(CHAIN_MIN_RANGE_PORT, CHAIN_MAX_RANGE_PORT) });

		sendPort();

		const countAttempts = {};
		let startingError = false;
		let processCounterId = 1;
		const options = {
			echorand: null,
			'data-dir': `${app.getPath('userData')}/${DATA_DIR}/${DEFAULT_NETWORK_ID}`,
			'rpc-endpoint': `127.0.0.1:${port}`,
			'seed-node': NETWORKS[DEFAULT_NETWORK_ID][LOCAL_NODE].seed,
		};

		const tryStart = (processId, params, accounts) => {

			if (processId < processCounterId) {
				return false;
			}

			clearTimeout(restartTimer);

			echoNode.stop().then(() => {
				restartTimer = setTimeout(() => {
					/* eslint-disable no-use-before-define */
					startNode(processId, params, accounts);
				}, RESTART_PAUSE_MS);
			});

			return true;

		};

		const incrementCounterId = (processId) => {
			if (!countAttempts[processId]) {
				countAttempts[processId] = 0;
			}

			countAttempts[processId] += 1;
		};

		const startNode = (processId, params, accounts) => {

			clearTimeout(restartTimer);

			if (startingError) {
				console.warn('startingError', startingError);
				return false;
			}

			try {
				incrementCounterId(processId);
				echoNode.start(params, accounts).then((data) => {
					console.log('[NODE] child then', data);
				}).catch((err) => {
					console.log('[NODE] child err', err);
					if (countAttempts[processId] === 1) {
						console.info('TRY TO START');
						tryStart(processId, params, accounts);
					} else if (countAttempts[processId] === 2) {
						rimraf(params['data-dir'], () => {
							console.info('TRY TO REMOVE FOLDER');
							tryStart(processId, params, accounts);
						});
					} else {
						startingError = true;
					}

				});

			} catch (e) {
				console.log('[NODE] error:', e);
			}

			return true;
		};

		startNode(processCounterId += 1, options, []);

		ipcMain.on('startNode', async (event, args) => {
			console.info('START NODE WITH ARGUMENTS', args);

			const NETWORK_ID = args && args.networkId ? args.networkId : DEFAULT_NETWORK_ID;

			const networkOptions = {
				echorand: null,
				'data-dir': `${app.getPath('userData')}/${DATA_DIR}/${NETWORK_ID}`,
				'rpc-endpoint': `127.0.0.1:${port}`,
				'seed-node': NETWORKS[NETWORK_ID][LOCAL_NODE].seed,
			};

			tryStart(processCounterId += 1, networkOptions, args && args.accounts ? args.accounts : []);
		});

	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.webContents.on('new-window', (e, url) => {
		if (url !== mainWindow.webContents.getURL()) {
			e.preventDefault();
			shell.openExternal(url);
		}
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	new AppUpdater();

});


if (process.env.DEBUG_PROD) {
	const fs = require('fs');
	const access = fs.createWriteStream(`${app.getPath('userData')}/app.log`);
	/* eslint-disable no-multi-assign */
	process.stdout.write = process.stderr.write = access.write.bind(access);
	process.on('uncaughtException', (err) => {
		console.error((err && err.stack) ? err.stack : err);
	});
}

ipcMain.on('showWindow', () => {
	mainWindow.show();
});

ipcMain.on('close-app', (event) => {
	if (!app.isQuiting) {
		event.preventDefault();

		if (process.platform !== 'darwin') {
			app.quit();
		} else {
			mainWindow.hide();
		}
	}
});

ipcMain.on('showWindow', () => {
	mainWindow.show();
});

ipcMain.on('zoom-app', () => {
	if (!mainWindow.isMaximized()) {
		mainWindow.maximize();
	} else {
		mainWindow.unmaximize();
	}
});

ipcMain.on('minimize-app', (event) => {
	event.preventDefault();
	mainWindow.minimize();
});
