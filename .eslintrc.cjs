module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'prettier'
	],
	ignorePatterns: [
		'dist/**',
		'node_modules/**',
		'**/*.min*.js',
		'**/static/scripts/app.js'
	],
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module'
	},
	env: {
		es6: true,
		node: true
	},
	overrides: [
		{
			files: ['**/*.test.js'],
			plugins: ['jest'],
			extends: ['plugin:jest/recommended'],
			env: {
				jest: true
			}
		},
		{
			files: ['apps/web/src/client/**', 'apps/web/testing/app/mocks/client-side.js'],
			env: {
				browser: true
			}
		}
	]
};
