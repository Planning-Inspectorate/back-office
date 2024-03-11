export default {
	transform: {},
	moduleNameMapper: { '^uuid$': 'uuid' },
	setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
	testRegex: '(/__tests__/.*|(\\.|/)(test))\\.test\\.js$'
};
