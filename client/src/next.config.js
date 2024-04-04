const withPlugins = require('next-compose-plugins')
const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
const webpack = require("webpack")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const magicImporter = require('node-sass-magic-importer')
// const path = require("path");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
require('dotenv').config()

module.exports = withPlugins(
	[withSass, withCss],{
		webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
			// Fixes npm packages that depend on `fs` module
			config.node = { fs: 'empty'	}
			/**
			 * Returns environment variables as an object
			 */
			const env = Object.keys(process.env).reduce((acc, curr) => {
					 acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
					 return acc;
		   }, {});
		
			/** Allows you to create global constants which can be configured
			* at compile time, which in our case is our environment variables
			*/
			config.plugins.push(new webpack.DefinePlugin(env));
			// config.plugins.push(new MiniCssExtractPlugin({
			// 	filename: '[name].css'
			// }));
			// config.module.rules.push(
			// 	{
			// 		test: /\.js$/,
			// 		exclude: /node_modules/,
			// 		use: {
			// 			loader: 'babel-loader'
			// 		}
			// 	},
			// 	{
			// 		test: /\.(sa|sc|c)ss$/,
			// 		use: [
			// 			{
			// 				loader: MiniCssExtractPlugin.loader
			// 			},
			// 			'css-loader',
			// 			'postcss-loader',
			// 			{
			// 				loader: "sass-loader",
			// 				options: {
			// 					implementation: require("node-sass"),
			// 					sassOptions: {
			// 						importer: magicImporter()
			// 					}
			// 				}
			// 			},
			// 		],
			// 	}
			// )
			const originalEntry = config.entry
			// config.entry = async () => {
			// const entries = await originalEntry()
			// 	if (
			// 		entries['main.js'] &&
			// 		!entries['main.js'].includes('./polyfills.js')
			// 	) {
			// 		entries['main.js'].unshift('./polyfills.js')
			// 	}
			// 	return entries
			// }

			return config
		},
		devIndicators: {
			autoPrerender: false,
		},
		generateEtags: false,
		// compress: false,
		// onDemandEntries: {
		// 	maxInactiveAge: 25 * 1000,
		// 	pagesBufferLength: 2
		// },
		typescript: {
			ignoreDevErrors: true,
		},
		// onDemandEntries: {
		// 	// period (in ms) where the server will keep pages in the buffer
		// 	maxInactiveAge: 60 * 60 * 25 * 1000,
		// 	// number of pages that should be kept simultaneously without being disposed
		// 	pagesBufferLength: 8,
		// },
	}
);


// module.exports = withCss(withSass(
// 	{
// 			cssModules: true,
// 			cssLoaderOptions: {
// 			importLoaders: 1,
// 			localIdentName: "[local]___[hash:base64:5]",
// 		},
// 		webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
// 			// Fixes npm packages that depend on `fs` module
// 			// config.node = { fs: 'empty'	}
// 			/**
// 			 * Returns environment variables as an object
// 			 */
// 			const env = Object.keys(process.env).reduce((acc, curr) => {
// 					 acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
// 					 return acc;
// 		   }, {});
		
// 			/** Allows you to create global constants which can be configured
// 			* at compile time, which in our case is our environment variables
// 			*/
// 			config.plugins.push(new webpack.DefinePlugin(env));
// 			// config.plugins.push(new MiniCssExtractPlugin({
// 			// 	filename: '[name].css'
// 			// }));
// 			// config.module.rules.push(
// 			// 	{
// 			// 		test: /\.js$/,
// 			// 		exclude: /node_modules/,
// 			// 		use: {
// 			// 			loader: 'babel-loader'
// 			// 		}
// 			// 	},
// 			// 	{
// 			// 		test: /\.(sa|sc|c)ss$/,
// 			// 		use: [
// 			// 			{
// 			// 				loader: MiniCssExtractPlugin.loader
// 			// 			},
// 			// 			'css-loader',
// 			// 			'postcss-loader',
// 			// 			'sass-loader'
// 			// 		],
// 			// 	}
// 			// )
// 			return config
// 		},
// 		devIndicators: {
// 			autoPrerender: false,
// 		},
// 	}
// ));
	
	