import { jest } from '@jest/globals';

/**
 * Builds a mock Azure Functions context for use across Function test suites.
 *
 * @returns {{ log: jest.Mock & { info: jest.Mock, warn: jest.Mock, error: jest.Mock } }}
 */
export const createMockContext = () => {
	const log = jest.fn();
	log.info = jest.fn();
	log.warn = jest.fn();
	log.error = jest.fn();
	return { log };
};
