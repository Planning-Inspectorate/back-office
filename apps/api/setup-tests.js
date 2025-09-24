// Setup global test cleanup and configuration
import 'dotenv/config';
import { jest, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';
import { clearDatabase, closeDatabase, connect } from '../src/test/test-db-connection.js';

// Mock timers by default for consistent behavior
jest.useFakeTimers();

// Configure Jest for better memory management and timeouts
jest.setTimeout(30000); // 30 second timeout

beforeAll(async () => {
	// Initialize database connection for tests
	await connect();

	// Clear any test data or mocks that might persist between test runs
	jest.clearAllMocks();
});

beforeEach(async () => {
	// Reset database to clean state before each test
	await clearDatabase();

	// Reset all mocks and clear any side effects
	jest.resetModules();
	jest.resetAllMocks();

	// Clear cache to prevent test pollution
	jest.isolateModules(() => {
		// Run each test in isolation
	});
});

afterEach(() => {
	// Clean up any remaining mocks or test data
	jest.clearAllMocks();
});

afterAll(async () => {
	// Close database connection
	await closeDatabase();

	// Ensure any open handles are closed
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Clear any remaining timeouts/intervals
	jest.useRealTimers();
});
