import appRootDir from 'app-root-dir';
import { join as joinPath, dirname } from 'path';
import _spawn from 'cross-spawn';

import getPlatform from './get-platform';

class EchoNode {

	constructor() {
		this.child = null;
	}

	/**
	 *
	 * @param {Object} params
	 * @param {Array} accounts
	 * @return {Promise.<*>}
	 */
	async start(params, accounts = []) {

		await this.stop();

		console.log('appRootDir.get()', appRootDir.get());

		const execPath = process.env.NODE_ENV === 'production' ? joinPath(dirname(appRootDir.get()), 'bin') : joinPath(appRootDir.get(), 'resources', getPlatform(), 'bin');

		console.log('execPath', execPath);

		const binPath = `${joinPath(execPath, 'echo_node')}`;

		const child = this.spawn(binPath, params, accounts);

		this.child = child;

		return child;
	}

	async stop() {
		return new Promise((resolve) => {

			const { child } = this;

			if (!child) {
				return resolve(true);
			}

			if (child.exited) {
				return resolve();
			}

			child.then(() => {
				child.exited = true;
				this.child = null;
				return resolve();
			}).catch(() => {
				child.exited = true;
				this.child = null;
				return resolve();
			});

			child.kill('SIGINT');

			return true;

		});
	}

	/**
	 *
	 * @param {Object} opts
	 * @return {Array}
	 */
	flags(opts = {}) {
		const args = [];

		/* eslint-disable no-restricted-syntax */
		for (const [key, value] of Object.entries(opts)) {
			if (key.toLowerCase() !== key) {
				throw Error('Options must be lowercase');
			}

			const arg = `--${key}${value === null ? '' : `=${value.toString()}`}`;
			args.push(arg);
		}

		return args;

	}

	/**
	 *
	 * @param {String} binPath
	 * @param {Object} opts
	 * @param {Array} accounts
	 * @return {*}
	 */
	spawn(binPath, opts, accounts = []) {

		const args = this.flags(opts);

		const env = Object.create(process.env);

		let accountsStr = '';

		accounts.forEach((account) => {
			accountsStr += `--account-info=${JSON.stringify([account.id, account.key])} `;
		});

		args.push(accountsStr);

		console.info(`spawning: echo_node ${args.join(' ')}`);

		const start = Date.now();
		const child = _spawn(binPath, args, {
			// shell: true,
			detached: true,
			env,
		});

		child.started = true;

		child.unref();

		process.once('exit', () => {
			child.kill('SIGINT');
		});

		if (child.stdout) {
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);

		}

		const promise = new Promise((resolve, reject) => {
			child.once('exit', (code) => {

				child.started = false;

				if (code !== 0) {
					let err;
					if (Date.now() - start < 1000) {
						const read = child.stderr.read();

						const stderr = read ? read.toString() : read;
						err = Error(stderr);
					} else {
						err = Error(`echo_node exited with code ${code}`);
					}
					return reject(err);
				}

				return resolve();
			});

			child.once('error', () => {
				child.started = false;
				return reject();
			});
		});

		child.then = promise.then.bind(promise);
		child.catch = promise.catch.bind(promise);

		return child;
	}


}

export default EchoNode;
