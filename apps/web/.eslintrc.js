const merge = require('lodash/merge');
const eslintConfig = require('eslint-config');

module.exports = merge(eslintConfig, {
	root: true
});
