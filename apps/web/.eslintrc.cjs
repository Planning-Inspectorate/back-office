const eslintConfig = require('eslint-config');

eslintConfig.root = true;

eslintConfig.rules = [
	...eslintConfig.rules,
	{
		'unicorn/consistent-destructuring': 'warn'
	}
];

module.exports = eslintConfig;
