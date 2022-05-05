module.exports = {
	extends: ['./configs/recommended.js'],
	root: true,
	env: {
		commonjs: true
	},
	rules: {
		'unicorn/prefer-module': 'off'
	}
};
