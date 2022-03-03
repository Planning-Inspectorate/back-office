'use strict';

module.exports = {
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: [
		'import',
		'eslint-comments',
		'jsdoc',
		'promise',
		'filenames',
		'unicorn'
	],
	extends: [
		'eslint:recommended',
		...[
			'./rules/possible-errors',
			'./rules/best-practices',
			'./rules/variables',
			'./rules/eslint-node',
			'./rules/stylistic-issues',
			'./rules/es6'
		].map((element) => require.resolve(element)),
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:eslint-comments/recommended',
		'plugin:promise/recommended',
		'plugin:jsdoc/recommended',
		'plugin:unicorn/recommended',
	],
	env: {
		'es2022': true,
		es6: true,
		browser: true,
		node: true
	},
	settings: {
		'import/ignore': [
			'node_modules',
			'.json$',
			'.(scss|less|css|styl)$'
		]
	},
	rules: {
		'filenames/match-exported': 0,
		'filenames/no-index': 0,
		'unicorn/prefer-module': 0,
		'unicorn/prevent-abbreviations': 1
	}
};
