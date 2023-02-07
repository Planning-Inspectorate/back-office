module.exports = {
	overrides: [
		{
			files: ['**/__tests__/*','**/swagger.js','setup-tests.js'],
			rules: {
				// allow devdependencies
				// https://github.com/weiran-zsd/eslint-plugin-node/blob/cb4f099ae928d627abfc635966622cf4266a7b1c/docs/rules/no-unpublished-import.md
				'n/no-unpublished-import': ['off'],
				'no-undef': ['off'],
				'max-params': ['off'],
				'no-undefined': ['off']
			}
		}
	]
};
