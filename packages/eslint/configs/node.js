/**
 * @file
 * Configuration for the 'eslint-plugin-node' plugin.
 */

module.exports = {
	plugins: ['n'],
	extends: ['plugin:n/recommended'],
	rules: {
		// enforce the style of file extensions in import declarations
		// https://github.com/mysticatea/eslint-plugin-node/blob/HEAD/docs/rules/file-extension-in-import.md
		'n/file-extension-in-import': [
			'error',
			'always',
			{
				'@pins/*': 'never'
			}
		]
	},
	settings: {
		n: {
			tryExtensions: ['.js', '.json', '.node']
		}
	}
};
