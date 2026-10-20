// @ts-nocheck
import { jest } from '@jest/globals';
import api from '../back-office-api-client.js';
import run from '../index.js';

describe('dco-submission-command', () => {
	const mockContext = { log: jest.fn() };

	const mockFolders = [
		{ id: 1, parentFolderId: null, displayNameEn: 'Acceptance' },
		{ id: 2, parentFolderId: 1, displayNameEn: 'Application documents' },
		{ id: 10, parentFolderId: 2, displayNameEn: 'Plans' }
	];

	const makeMessage = (count) => ({
		mappedCaseData: {
			case: { reference: 'EN020034' }
		},
		mappedDocuments: Array.from({ length: count }, (_, index) => ({
			documentName: `document_${index + 1}.pdf`,
			documentSize: 1024,
			documentType: 'application/pdf',
			blobStoreUrl: `application/EN020034/plans-and-drawings/doc_${index + 1}.pdf`
		}))
	});

	beforeEach(() => {
		jest.clearAllMocks();
		api.getCaseID = jest.fn().mockResolvedValue(1);
		api.getAllFoldersOnCase = jest.fn().mockResolvedValue(mockFolders);
		api.postDocuments = jest.fn().mockResolvedValue({});
	});

	test('posts documents in batches of 50', async () => {
		await run(mockContext, makeMessage(120));

		expect(api.getCaseID).toHaveBeenCalledWith('EN020034');
		expect(api.postDocuments).toHaveBeenCalledTimes(3);
		expect(api.postDocuments.mock.calls[0][1]).toHaveLength(50);
		expect(api.postDocuments.mock.calls[1][1]).toHaveLength(50);
		expect(api.postDocuments.mock.calls[2][1]).toHaveLength(20);
	});

	test('throws an error when the case does not exist', async () => {
		api.getCaseID = jest.fn().mockResolvedValue(null);

		await expect(run(mockContext, makeMessage(1))).rejects.toThrow(
			'No case found with caseReference: EN020034'
		);

		expect(api.postDocuments).not.toHaveBeenCalled();
	});
});
