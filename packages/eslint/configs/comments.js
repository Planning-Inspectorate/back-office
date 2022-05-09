/**
 * @file
 * Configuration for the 'eslint-plugin-eslint-comments' plugin.
 */

module.exports = {
	plugins: ['eslint-comments'],
	extends: ['plugin:eslint-comments/recommended'],
	rules: {
		'eslint-comments/no-use': 'error'
	}
};
