export default {
	maxWorkers: '50%', // Use 50% of available CPU cores
	workerIdleMemoryLimit: '2048MB', // Restart workers if they exceed 2GB memory
	maxConcurrency: 5, // Maximum number of tests running in parallel

	// Performance optimizations
	slowTestThreshold: 10000, // Mark tests as slow if they take more than 10s
	testTimeout: 30000, // 30 second timeout
	workerThreads: true, // Enable worker threads for better isolation

	// Failure handling
	bail: 0, // Don't stop on first failure
	detectLeaks: true, // Detect memory leaks
	detectOpenHandles: true, // Help identify hanging processes

	coverageProvider: 'v8',
	transform: {},
	moduleNameMapper: { '^uuid$': 'uuid' },
	setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
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
