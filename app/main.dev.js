/* eslint-disable no-undef */
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
import { xor } from 'lodash';
import log from 'electron-log';
import appRootDir from 'app-root-dir';
import notifier from 'node-notifier';
import { join as joinPath, dirname } from 'path';
import rimraf from 'rimraf';
import i18next from 'i18next';
import { PrivateKey } from 'echojs-lib';
import { Subject, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import TimeOffset from './main/time-offset';
import MenuBuilder from './menu';
import EchoNode from './main/echo-node';
import getPlatform from './main/get-platform';


import {
	DATA_DIR,
	CHAIN_MIN_RANGE_PORT,
	CHAIN_MAX_RANGE_PORT,
} from './constants/chain-constants';

import {
	APP_WINDOW_HEIGHT,
	APP_WINDOW_WIDTH,
	APP_WINDOW_MIN_HEIGHT,
	APP_WINDOW_MIN_WIDTH,
	TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS,
	DEFAULT_NETWORK_ID,
} from './constants/global-constants';
import { WIN_PLATFORM } from './constants/platform-constants';
import EN_TRANSLATION from './translations/en';


app.commandLine.appendSwitch('js-flags', '--max-old-space-size=8096');

let quited = false;
export default class AppUpdater {

	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		// autoUpdater.checkForUpdatesAndNotify();
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
			mainWindow.show();
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

let lastNode = null;
let restartTimer = null;
let tray = null;

async function createWindow() {
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

	tray = new Tray(`${execPath}/16x16.png`);

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

	tray.on('click', () => mainWindow.show());

	if (
		process.env.NODE_ENV === 'development'
		|| process.env.DEBUG_PROD === 'true'
	) {
		await installExtensions();
	}

	await i18next.init({
		lng: 'en',
		debug: false,
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
		webPreferences: {
			nodeIntegration: true,
		},
		frame: false,
		transparent: true,
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

		const subject = new Subject();
		let previousPublicKeys = [];

		function removeFolderAndRetrySyncNode(dataDir) {
			previousPublicKeys = [];
			rimraf(dataDir, () => {});
			lastNode = null;
		}

		subject.pipe(
			switchMap((data) => {
				const promise = data.lastNode ? data.lastNode.stop() : Promise.resolve();
				return from(promise.then(() => ({
					networkOptions: data.networkOptions,
					accounts: data.accounts,
					chainToken: data.chainToken,
				})));
			}),
		).subscribe((data) => {
			lastNode = new EchoNode();
			const dataDir = data.networkOptions['data-dir'];
			lastNode.start(data.networkOptions, data.accounts, data.chainToken).then(() => {
				if (!quited && !lastNode.stopInProcess) {
					removeFolderAndRetrySyncNode(dataDir);
				}
			}).catch(() => {
				if (!quited && !lastNode.stopInProcess) {
					removeFolderAndRetrySyncNode(dataDir);
				}
			});
		});

		ipcMain.on('startNode', async (_, args) => {

			const NETWORK_ID = args && args.networkId ? args.networkId : DEFAULT_NETWORK_ID;
			const chainToken = args && args.chainToken ? args.chainToken : null;

			const networkOptions = {
				'data-dir': `${app.getPath('userData')}/${DATA_DIR}/${NETWORK_ID}`,
				'rpc-endpoint': `127.0.0.1:${port}`,
				plugin: 'registration',
				testnet: null,
				// 'replay-blockchain': null,
			};

			const accounts = args && args.accounts ? args.accounts : [];

			const receivedPublicKeys = accounts.map(({ key }) => PrivateKey.fromWif(key).toPublicKey().toString());

			if (!lastNode || previousPublicKeys.length !== receivedPublicKeys.length || xor(receivedPublicKeys, previousPublicKeys).length) {
				subject.next({
					lastNode,
					networkOptions,
					accounts,
					chainToken,
				});
			}

			previousPublicKeys = receivedPublicKeys;

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
}
app.on('before-quit', (event) => {

	quited = true;

	if (restartTimer) {
		clearTimeout(restartTimer);
		restartTimer = null;
	}

	console.log(`Caught before-quit. Exiting in ${TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS} seconds.`);

	event.preventDefault();

	if (lastNode && lastNode.child) {
		lastNode.child.then(() => {
			process.exit(0);
		}).catch(() => {
			process.exit(0);
		});

		lastNode.stop();

		setTimeout(() => { process.exit(0); }, TIMEOUT_BEFORE_APP_PROCESS_EXITS_MS);

	} else {
		process.exit(0);
	}

});

/**
 * It is electron bug on linux
 * https://github.com/electron/electron/issues/15947
 *
 */
app.on('ready', () => setTimeout(createWindow, 100));

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	} else {
		mainWindow.show();
	}
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

ipcMain.on('close-app', (event) => {
	if (!app.isQuiting) {
		event.preventDefault();
		mainWindow.hide();
	}
});

ipcMain.on('zoom-app', () => {
	if (!mainWindow.isMaximized()) {
		mainWindow.maximize();
	} else {
		mainWindow.unmaximize();
	}
});

ipcMain.on('showWindow', () => {
	mainWindow.show();
});

ipcMain.on('minimize-app', (event) => {
	event.preventDefault();
	mainWindow.minimize();
});
