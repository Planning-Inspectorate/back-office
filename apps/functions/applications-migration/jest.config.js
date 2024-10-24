export default {
	testTimeout: 30000,
	testRegex: '(/__tests__/.*|(\\.|/)(test))\\.test\\.js$',
	setupFilesAfterEnv: [
		'<rootDir>/__tests__/setup/mock-db-queries.js',
		'<rootDir>/__tests__/setup/mock-reset.js'
	]
};
