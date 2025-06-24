import { jest } from '@jest/globals';
import { generateDocumentNameOnDeletion } from '../utils/generate-document-name-on-deletion.js';

const mockDate = new Date('2023-11-01T00:00:00Z');

describe('generate-document-name-on-deletion.js', () => {
	beforeAll(() => {
		jest.useFakeTimers({ advanceTimers: true }).setSystemTime(mockDate);
	});

	afterAll(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('should generate a document name with deletion suffix and timestamp', () => {
		const mockDocumentName = 'mock-document';
		const result = generateDocumentNameOnDeletion(mockDocumentName);

		expect(result).toBe(`mock-document_deleted_20231101_000000`);
	});
});
