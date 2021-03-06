/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../internals/scripts/CheckNodeEnv';

CheckNodeEnv('production');
export default merge.smart(baseConfig, {
	devtool: 'source-map',

	mode: 'production',

	target: 'electron-renderer',

	entry: path.join(__dirname, '..', 'app/index'),

	output: {
		path: path.join(__dirname, '..', 'app/dist'),
		publicPath: './dist/',
		filename: 'renderer.prod.js',
	},

	module: {
		rules: [
			// Extract all .global.css to style.css as is
			{
				test: /\.global\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: './',
						},
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
						},
					},
				],
			},
			// Pipe other styles through css modules and append to style.css
			{
				test: /^((?!\.global).)*\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							modules: false,
							sourceMap: false,
						},
					},
				],
			},
			// Add SASS support  - compile all .global.scss files and pipe it to style.css
			{
				test: /\.global\.(scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
							importLoaders: 1,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false,
						},
					},
				],
			},
			// Add SASS support  - compile all other .scss files and pipe it to style.css
			{
				test: /^((?!\.global).)*\.(scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							modules: false,
							importLoaders: 1,
							sourceMap: false,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false,
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'url-loader?limit=100000',
			},
			// SVG Font
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'image/svg+xml',
					},
				},
			},
			// Common Image Formats
			{
				test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
				use: 'url-loader',
			},
		],
	},

	optimization: {
		minimizer: process.env.E2E_BUILD
			? []
			: [
				new TerserPlugin({
					parallel: true,
					sourceMap: true,
					cache: true,
				}),
				new OptimizeCSSAssetsPlugin({
					cssProcessorOptions: {
						map: {
							inline: false,
							annotation: true,
						},
					},
				}),
			],
	},

	plugins: [
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
			NODE_ENV: 'production',
		}),

		new MiniCssExtractPlugin({
			filename: 'style.css',
		}),

		new BundleAnalyzerPlugin({
			analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
			openAnalyzer: process.env.OPEN_ANALYZER === 'true',
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
	],
});
