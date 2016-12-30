var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

	entry: {
		index: ['./src/js/entry.js']
	},
	output: {
		path: path.resolve(__dirname, './dist/static'),
		publicPath: 'static/',
		filename: '[name].[chunkhash].js'
	},
	resolve: {
		extensions: ['', '.js', '.less', '.swig', '.html']
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				// loader: 'style!css'
				loader: ExtractTextPlugin.extract('style-loader', ['css-loader'])
			},
			{
				test: /\.less$/,
				// loader: 'style!css!less'
				loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'less-loader'])
			},
			{
				test: /\.swig/,
				loader: 'swig'
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('[name].[chunkhash].css'),
		/**
		 * 把chunks入口文件的资源导出到html中
		 * 资源可能是 css 或者 js等
		 * css的话 使用配合ExtractTextPlugin使用
		 */
		new HtmlWebpackPlugin({
			chunks: ['index'], //放入口文件的key即可 因为每个key对应一个输出对象js
			filename: '../index.html',  //这个路径是相对于path
			template: './src/tpl/index.html',
			inject: true
		})
	]
}
