'use strict';

module.exports = {
	rules: {
		'init-declarations': 0,
		'no-delete-var': 2,
		'no-label-var': 2,
		'no-restricted-globals': [
			'error',
			'event',
			'fdescribe'
		],
		'no-shadow': 2,
		'no-shadow-restricted-names': 2,
		'no-undef': 2,
		'no-undef-init': 2,
		'no-undefined': 0,
		'no-unused-vars': [
			2,
			{
				'argsIgnorePattern': '^_',
				'varsIgnorePattern': '^ignored',
				'args': 'after-used',
				'ignoreRestSiblings': true
			}
		],
		'no-use-before-define': [
			'error',
			'nofunc'
		]
	}
};
