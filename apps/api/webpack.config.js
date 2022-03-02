const path = require('path');
const {
	NODE_ENV = 'production',
} = process.env;
module.exports = {
	entry: './src/server.js',
	mode: NODE_ENV,
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js'
	},
	resolve: {
		extensions: ['.js'],
	},
	module: {
		rules: [{
			test: /\.test.js$/
		}]
	}
}
