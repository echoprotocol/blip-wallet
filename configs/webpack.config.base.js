/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies } from '../package.json';

export default {
	externals: [...Object.keys(dependencies || {})],

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
					},
				},
			},
		],
	},

	output: {
		path: path.join(__dirname, '..', 'app'),
		// https://github.com/webpack/webpack/issues/1114
		libraryTarget: 'commonjs2',
	},

	/**
   * Determine the array of extensions that should be used to resolve modules.
   */
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
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
		new webpack.NamedModulesPlugin(),
	],
};
