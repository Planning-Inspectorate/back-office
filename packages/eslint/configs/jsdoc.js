/**
 * @file
 * Configuration for the 'eslint-plugin-jsdoc' plugin.
 */

module.exports = {
	plugins: ['jsdoc'],
	extends: ['plugin:jsdoc/recommended'],
	rules: {
		// https://www.npmjs.com/package/eslint-plugin-jsdoc#user-content-eslint-plugin-jsdoc-rules
		'jsdoc/require-jsdoc': 'error',
		'jsdoc/require-param': 'error',
		'jsdoc/require-param-description': 'off',
		'jsdoc/require-param-name': 'error',
		'jsdoc/require-param-type': 'error',
		'jsdoc/require-property': 'error',
		'jsdoc/require-property-description': 'off',
		'jsdoc/require-property-name': 'error',
		'jsdoc/require-property-type': 'error',
		'jsdoc/require-returns': 'error',
		'jsdoc/require-returns-check': 'error',
		'jsdoc/require-returns-description': 'off',
		'jsdoc/require-returns-type': 'error'
	},
	settings: {
		jsdoc: {
			mode: 'typescript'
		}
	}
};
