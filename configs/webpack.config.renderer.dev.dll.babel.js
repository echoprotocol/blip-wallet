/* eslint global-require: off, import/no-dynamic-require: off */

/**
 * Builds the DLL for development electron renderer process
 */

import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import { dependencies } from '../package.json';
import CheckNodeEnv from '../internals/scripts/CheckNodeEnv';

CheckNodeEnv('development');

const dist = path.join(__dirname, '..', 'dll');

export default merge.smart(baseConfig, {
	context: path.join(__dirname, '..'),

	devtool: 'eval',

	mode: 'development',

	target: 'electron-renderer',

	externals: ['fsevents', 'crypto-browserify'],

	/**
   * Use `module` from `webpack.config.renderer.dev.js`
   */
	module: require('./webpack.config.renderer.dev.babel').default.module,

	entry: {
		renderer: Object.keys(dependencies || {}),
	},

	output: {
		library: 'renderer',
		path: dist,
		filename: '[name].dev.dll.js',
		libraryTarget: 'var',
	},

	plugins: [
		new webpack.DllPlugin({
			path: path.join(dist, '[name].json'),
			name: '[name]',
		}),
		new webpack.DefinePlugin({
			NETWORKS: {
				devnet: {
					remote: {
						name: JSON.stringify('Remote node'),
						url: JSON.stringify('wss://devnet.echo-dev.io/ws'),
					},
					local: {
						name: JSON.stringify('Local node'),
						seed: JSON.stringify('node1.devnet.echo-dev.io:6310'),
					},
				},
				testnet: {
					remote: {
						name: JSON.stringify('Remote node'),
						url: JSON.stringify('ws://testnet.echo-dev.io/ws'),
					},
					local: {
						name: JSON.stringify('Local node'),
						seed: JSON.stringify('node1.devnet.echo-dev.io:6310'),
					},
				},
			},
			EXPLORER_URL: {
				devnet: JSON.stringify('https://656-echo-explorer.pixelplex-test.by'),
				testnet: JSON.stringify('https://explorer.echo.org'),
			},
			ECHODB: {
				devnet: {
					HTTP_LINK: JSON.stringify('https://645-echodb.pixelplex-test.by/graphql'),
					WS_LINK: JSON.stringify('wss://645-echodb.pixelplex-test.by/graphql'),
				},
				testnet: {
					HTTP_LINK: JSON.stringify('https://645-echodb.pixelplexlabs.com/graphql'),
					WS_LINK: JSON.stringify('wss://645-echodb.pixelplexlabs.com/graphql'),
				},
			},
			QR_SERVER_URL: {
				devnet: JSON.stringify('https://649-bridge-landing.pixelplex-test.by/receive/'),
				testnet: JSON.stringify('https://649-bridge-landing.pixelplexlabs.com/receive/'),
			},
		}),

		/**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
		}),

		new webpack.LoaderOptionsPlugin({
			debug: true,
			options: {
				context: path.join(__dirname, '..', 'app'),
				output: {
					path: path.join(__dirname, '..', 'dll'),
				},
			},
		}),
	],
});
