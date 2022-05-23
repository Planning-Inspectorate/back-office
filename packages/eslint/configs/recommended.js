const path = require('path');
const plugins = ['eslint', 'comments', 'jsdoc', 'node', 'simple-import-sort', 'unicorn'];

module.exports = {
	extends: plugins.map((pluginName) => path.join(__dirname, `./${pluginName}.js`)),
	env: {
		browser: true,
		node: true
	}
};
