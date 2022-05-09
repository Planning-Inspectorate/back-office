/**
 * @file
 * Configuration for the 'eslint-plugin-simple-import-sort' plugin.
 */

module.exports = {
	plugins: ['simple-import-sort'],
	rules: {
		// require simple sorting of imports
		// https://github.com/lydell/eslint-plugin-simple-import-sort
		'simple-import-sort/imports': [
			'error',
			{
				groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']]
			}
		]
	}
};
