export default {
	coverageProvider: 'v8',
	transform: {},
	moduleNameMapper: { '^uuid$': 'uuid' },
	setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
	coveragePathIgnorePatterns: ['src/server/migration'],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 75,
			lines: 73,
			statements: 73
		}
	},
	coveragePathIgnorePatterns: ['<rootDir>/src/server/migration/*']
};
