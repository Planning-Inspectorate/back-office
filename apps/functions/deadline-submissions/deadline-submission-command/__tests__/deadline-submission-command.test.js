// @ts-nocheck
import { BlobStorageClient } from '@pins/blob-storage-client';
import run from '../';
import api from '../back-office-api-client';
import { jest } from '@jest/globals';

describe('deadline-submission-command', () => {
	beforeEach(() => {
		api.getCaseID = jest.fn().mockResolvedValue(1);
		api.getFolderID = jest.fn().mockResolvedValue(1);
		api.lineItemExists = jest.fn().mockResolvedValue(true);
	});

	const mockContext = { log: jest.fn() };
	const mockMsg = {
		name: 'Test name',
		email: 'test@email.com',
		deadline: 'Test deadline',
		submissionType: 'Test submission type',
		blobGuid: 'test-guid',
		documentName: 'test-name'
	};

	test('Happy path', async () => {
		const mockSubmitDocument = jest.fn().mockResolvedValue({
			privateBlobContainer: 'test-container',
			documents: [{ blobStoreUrl: '/test/blob/url' }]
		});
		api.submitDocument = mockSubmitDocument;

		const mockCopyFile = jest.fn();
		BlobStorageClient.fromUrl = jest.fn().mockReturnValue({
			copyFile: mockCopyFile,
			getBlobProperties: () => ({
				contentType: 'application/octet-stream',
				contentLength: 1
			})
		});

		await run(mockContext, mockMsg);

		expect(mockSubmitDocument).toHaveBeenCalledWith(
			expect.objectContaining({
				caseID: 1,
				documentName: mockMsg.documentName,
				documentType: 'application/octet-stream',
				documentSize: 1,
				folderID: 1,
				userEmail: mockMsg.email
			})
		);

		expect(mockCopyFile).toHaveBeenCalledWith(
			expect.objectContaining({
				sourceBlobName: 'test-guid/test-name',
				destinationContainerName: 'test-container',
				destinationBlobName: '/test/blob/url'
			})
		);
	});
});
