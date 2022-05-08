/**
 * @file
 * Configuration for the 'unicorn' plugin.
 */

module.exports = {
	extends: ['plugin:unicorn/recommended'],
	plugins: ['unicorn'],
	rules: {
		// disallow the use of the null literal
		// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
		'unicorn/no-null': 'off',

		// prevent abbreviations
		// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/prevent-abbreviations.md
		'unicorn/prevent-abbreviations': [
			'error',
			{
				allowList: {
					// allow express request-handler signature
					req: true,
					res: true
				}
			}
		],

		// move function definitions to the highest possible scope
		// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-function-scoping.md
		'unicorn/consistent-function-scoping': 'off'
	}
};
