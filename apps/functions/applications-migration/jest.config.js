export default {
	testTimeout: 30000,
	testRegex: '(/__tests__/.*|(\\.|/)(test))\\.test\\.js$',
	setupFilesAfterEnv: [
		'<rootDir>/__tests__/setup/setup-backend.js',
		'<rootDir>/__tests__/setup/setup-env-vars.js'
	]
};
