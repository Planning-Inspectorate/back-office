export default {
	testTimeout: 30000,
	testRegex: '(/__tests__/.*|(\\.|/)(test))\\.test\\.js$',
	setupFilesAfterEnv: ['<rootDir>/__tests__/setup-api.js', '<rootDir>/__tests__/setup-env-vars.js']
};
