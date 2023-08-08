// @ts-nocheck
import { BlobServiceClient } from '@azure/storage-blob';
import run from '../';
import api from '../back-office-api-client';
import { jest } from '@jest/globals';

describe('deadline-submission-command', () => {
	beforeAll(() => {
		api.getCaseID = jest.fn().mockResolvedValue(1);
		api.getFolderID = jest.fn().mockResolvedValue(1);

		BlobServiceClient.fromConnectionString = jest.fn().mockReturnValue({
			getContainerClient: () => ({
				getBlobClient: () => ({
					beginCopyFromURL: () => ({
						pollUntilDone: () => ({
							copyStatus: 'success'
						})
					}),
					getProperties: () => ({
						contentType: 'application/octet-stream',
						contentLength: 1
					})
				})
			})
		});
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
		const mockSubmitDocument = jest.fn();
		api.submitDocument = mockSubmitDocument;

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
	});
});
