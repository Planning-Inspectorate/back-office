export default {
	transform: {},
	moduleNameMapper: { '^uuid$': 'uuid' },
	setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 50,
			lines: 73,
			statements: 73
		}
	}
};
