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
					'@pins/applications',
					'@pins/express',
					'@pins/platform',
					'@pins/rollup',
					'@pins/web',
					'@pins/event-client'
				]
			}
		],

		// allow dev dependencies in common js files, as they're exclusively used for build/pre-build steps
		// https://github.com/weiran-zsd/eslint-plugin-node/blob/cb4f099ae928d627abfc635966622cf4266a7b1c/docs/rules/no-unpublished-require.md
		'n/no-unpublished-require': 'off',

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
