/**
 * @file
 * Configuration for the 'eslint-jest' plugin within test files.
 */

module.exports = {
	overrides: [
		{
			files: ['**/*.test.js'],
			plugins: ['jest'],
			extends: ['plugin:jest/recommended'],
			env: {
				jest: true
			}
		}
	]
};
