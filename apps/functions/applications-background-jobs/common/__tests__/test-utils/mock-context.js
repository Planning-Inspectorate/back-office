import { jest } from '@jest/globals';

/**
 * Builds a mock Azure Functions context.log, with info/warn/error sub-mocks,
 * shared across Function test suites instead of hand-rolling it per file.
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
