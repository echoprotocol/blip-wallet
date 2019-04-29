/* eslint-disable import/no-dynamic-require */

import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: `${__dirname}/../app/index.web.html`,
	filename: 'index.html',
	inject: 'body',
});

const timeCache = Date.now();
const port = process.env.PORT || 8888;

export default {
	node: {
		fs: 'empty',
	},
	entry: [path.resolve('app/index.js')].concat(
		process.env.NODE_ENV === 'production'
			? []
			: [
				'react-hot-loader/patch',
				`webpack-dev-server/client?http://localhost:${port}/`,
				'webpack/hot/only-dev-server',
			],
	),
	output: {
		publicPath: '/',
		path: path.resolve('dist'),
		filename: `[name].${timeCache}.js`,
		pathinfo: process.env.NODE_ENV === 'local',
		sourceMapFilename: '[name].js.map',
		chunkFilename: `[name].bundle.js?v=${timeCache}`,
	},
	devtool:
    process.env.NODE_ENV !== 'local' ? 'cheap-module-source-map' : 'eval',
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
			{
				test: /\.global\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /^((?!\.global).)*\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: false,
							sourceMap: true,
						},
					},
				],
			},
			// SASS support - compile all .global.scss files and pipe it to style.css
			{
				test: /\.global\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
					},
				],
			},
			// SASS support - compile all other .scss files and pipe it to style.css
			{
				test: /^((?!\.global).)*\.(scss|sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: false,
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
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
		splitChunks: {
			cacheGroups: {
				default: false,
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
			},
		},
	},
	resolve: {
		modules: ['node_modules', path.resolve('src')],
		extensions: ['.js', '.jsx', '.json'],
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['dist'] }),
		HTMLWebpackPluginConfig,
	],
	devServer: {
		port,
	},
};
