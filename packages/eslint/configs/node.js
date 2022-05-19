/**
 * @file
 * Configuration for the 'eslint-plugin-node' plugin.
 */

module.exports = {
	plugins: ['n'],
	extends: ['plugin:n/recommended'],
	rules: {
		// disallow import declarations which import extraneous modules
		// https://github.com/weiran-zsd/eslint-plugin-node/blob/master/docs/rules/no-extraneous-import.md
		'n/no-extraneous-import': [
			'error',
			{
				allowModules: [
					'@jest/globals',
					'@pins/api',
					'@pins/appeals',
					'@pins/express',
					'@pins/platform',
					'@pins/rollup',
					'@pins/web'
				]
			}
		],

		// deprecated
		// https://github.com/weiran-zsd/eslint-plugin-node/blob/HEAD/docs/rules/no-unsupported-features/es-syntax.md
		'n/no-unsupported-features/es-syntax': 'off',

		// enforce the style of file extensions in import declarations
		// https://github.com/weiran-zsd/eslint-plugin-node/blob/master/docs/rules/file-extension-in-import.md
		'n/file-extension-in-import': ['error', 'always']
	},
	settings: {
		n: {
			tryExtensions: ['.js', '.json', '.node']
		}
	}
};
