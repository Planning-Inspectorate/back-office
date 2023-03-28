module.exports = {
	overrides: [
		{
			files: ['**/__tests__/*'],
			rules: {
				// allow devdependencies
				// https://github.com/weiran-zsd/eslint-plugin-node/blob/cb4f099ae928d627abfc635966622cf4266a7b1c/docs/rules/no-unpublished-import.md
				'n/no-unpublished-import': 'off',
				'no-undef': 'off',
				'max-classes-per-file': ['off'],
			}
		},
		{
			files: ['setup-tests.js'],
			rules: {
				'max-classes-per-file': ['off']
			}
		},
        {
            files: ['*'],
            rules: {
                'unicorn/prefer-module': 'off',
                'n/no-missing-require': 'off',
                'n/no-extraneous-import': 'off'
            }
        }
	]
};
