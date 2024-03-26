export default {
	transform: {},
	moduleNameMapper: { '^uuid$': 'uuid' },
	setupFilesAfterEnv: [
		'<rootDir>/common/__tests__/test-setup/setup-client-mocks.js',
		'<rootDir>/common/__tests__/test-setup/setup-test-env-vars.js'
	],
	testRegex: '(/__tests__/.*|(\\.|/)(test))\\.test\\.js$'
};
