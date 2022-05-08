'use strict';

module.exports = {
	plugins: ['node'],
	extends: [
		// 'plugin:node/recommended'
		'plugin:node/recommended-module'
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		'no-console': 0,
		'no-process-exit': 'error',
		'unicorn/prefer-node-protocol': 0,
		'unicorn/no-null': 0,
		'node/exports-style': 'off',
		'node/file-extension-in-import': 0,
		'node/no-deprecated-api': 'error',
		'node/no-extraneous-import': 'off',
		'node/no-extraneous-require': 'off',
		'node/no-missing-import': 'off',
		'node/no-missing-require': 'off',
		'node/no-unpublished-bin': 'error',
		'node/no-unpublished-import': 'off',
		'node/no-unpublished-require': 'off',
		'node/prefer-global/buffer': ['error', 'always'],
		'node/prefer-global/console': ['error', 'always'],
		'node/prefer-global/process': ['error', 'always'],
		'node/prefer-global/text-decoder': ['error', 'always'],
		'node/prefer-global/text-encoder': ['error', 'always'],
		'node/prefer-global/url-search-params': ['error', 'always'],
		'node/prefer-global/url': ['error', 'always'],
		'node/prefer-promises/dns': 0,
		'node/prefer-promises/fs': 0,
		'node/process-exit-as-throw': 'error'
	},
	settings: {
		jsdoc: {
			mode: 'typescript'
		}
	}
};
