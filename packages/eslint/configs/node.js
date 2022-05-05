/**
 * @file
 * Configuration for the 'eslint-plugin-node' plugin.
 */

module.exports = {
	plugins: ['node'],
	extends: ['plugin:node/recommended'],
	rules: {
		// enforce the style of file extensions in import declarations
		// https://github.com/mysticatea/eslint-plugin-node/blob/HEAD/docs/rules/file-extension-in-import.md
		'node/file-extension-in-import': [
			'error',
			'always',
			{
				'@pins/*': 'never'
			}
		],

		'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }]
	},
	settings: {
		node: {
			tryExtensions: ['.js', '.json', '.node']
		}
	}
};
