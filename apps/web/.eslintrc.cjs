module.exports = {
	extends: ['plugin:pins/jest'],
	overrides: [
		{
			files: ['scripts/rollup/**', 'testing/**', '**/*.test.js'],
			rules: {
				// allow devdependencies
				// https://github.com/weiran-zsd/eslint-plugin-node/blob/cb4f099ae928d627abfc635966622cf4266a7b1c/docs/rules/no-unpublished-import.md
				'n/no-unpublished-import': 'off',
				'jest/valid-expect': 'off'

			}
		},
		{
			files: ['environment/schema.js'],
			rules: {
				// allow `then` within objects just for this file – joi's api is built around it
				// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/no-thenable.md
				'unicorn/no-thenable': 'off'
			}
		}
	]
};
