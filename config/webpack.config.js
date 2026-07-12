/**
 * Imports
 */

// Node
import path from 'path';

// Webpack
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

/**
 * Constants
 */
const isProduction = process.env.NODE_ENV?.toLowerCase() === 'production';


/**
 * Webpack Configuration
 */
export const mintWebpackConfig = {
	mode: isProduction ? 'production' : 'development',
	devtool: 'source-map',
	entry: {
		index: './src/ts/index.ts',
		mint: './src/scss/mint.scss',
		noscript: './src/scss/noscript.scss'
	},
	experiments: {
		outputModule: true
	},
	output: {
		filename: isProduction ? 'js/[name].min.js' : 'js/[name].js',
		chunkFilename: isProduction ? 'js/[name].[chunkhash].min.js' : 'js/[name].[chunkhash].js',
		path: path.resolve('dist'),
		library: {
			type: 'module'
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/i,
				exclude: '/node_modules/',
				use: ['ts-loader']
			},
			{
				test: /\.s[ac]ss$/i,
				exclude: '/node_modules/',
				use: [
					MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},
	plugins: [
        new RemoveEmptyScriptsPlugin(),
		new MiniCssExtractPlugin({
			filename: isProduction ? 'css/[name].min.css' : 'css/[name].css',
			chunkFilename: isProduction ? 'css/[name].[chunkhash].min.css' : 'css/[name].[chunkhash].css'
		})
	],
	resolve: {
		extensions: ['.ts', '...']
	}
};
export default mintWebpackConfig;
