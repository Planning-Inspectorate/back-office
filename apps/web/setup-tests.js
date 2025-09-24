/**
 * @jest-environment jsdom
 */

// Setup global test cleanup and configuration
import 'dotenv/config';
import { jest, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

// Mock timers by default for consistent behavior
jest.useFakeTimers();

// Configure Jest for better memory management and timeouts
jest.setTimeout(30000); // 30 second timeout

beforeAll(async () => {
	// Clear any test data or mocks that might persist between test runs
	jest.clearAllMocks();
	jest.clearAllTimers();

	// Reset modules to prevent test pollution
	jest.resetModules();

	// Clear any cached data
	global.gc && global.gc();
});

beforeEach(() => {
	// Start with a clean slate for each test
	jest.resetModules();
	jest.resetAllMocks();
	jest.clearAllMocks();

	// Reset timers for each test
	jest.clearAllTimers();
});

afterEach(() => {
	// Clean up any remaining mocks or test data
	jest.clearAllMocks();
	jest.clearAllTimers();

	// Clear any remaining timeouts or intervals
	jest.runOnlyPendingTimers();
});

afterAll(async () => {
	// Run any remaining timers
	jest.runOnlyPendingTimers();

	// Reset to real timers
	jest.useRealTimers();

	// Ensure any open handles are closed with a timeout
	/** @type {Promise<void>} */
	const closeHandles = new Promise((resolve) => {
		const timeout = setTimeout(() => {
			console.warn('Warning: Had to force close some test handles');
			resolve();
		}, 1000);

		// Clean up timeout if we resolve early
		setTimeout(() => {
			clearTimeout(timeout);
			resolve();
		}, 500);
	});

	await closeHandles;

	// Final garbage collection if available
	global.gc && global.gc();
});
