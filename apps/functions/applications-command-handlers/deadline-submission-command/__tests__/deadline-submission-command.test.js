// @ts-nocheck
import run from '../';
import blobClient from '../blob-client';
import api from '../back-office-api-client';
import eventClient from '../event-client';
import { jest } from '@jest/globals';

describe('deadline-submission-command', () => {
	const mockSendEvents = jest.fn();

	beforeEach(() => {
		api.getCaseID = jest.fn().mockResolvedValue(1);
		api.getFolderID = jest.fn().mockResolvedValue(1);
		api.lineItemExists = jest.fn().mockResolvedValue(true);
		api.populateDocumentMetadata = jest.fn();

		eventClient.publishFailureEvent = mockSendEvents;

		blobClient.getBlobProperties = jest.fn().mockResolvedValue({
			contentType: 'application/octet-stream',
			contentLength: 1
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

	test('Success', async () => {
		const mockSubmitDocument = jest.fn().mockResolvedValue({
			privateBlobContainer: 'test-container',
			documents: [{ blobStoreUrl: '/application/blob/url/1' }]
		});
		api.submitDocument = mockSubmitDocument;

		blobClient.copyFile = jest.fn().mockResolvedValueOnce(true);

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

		expect(mockSendEvents).not.toHaveBeenCalled();
	});

	test('Failure', async () => {
		api.submitDocument = jest.fn().mockResolvedValueOnce({
			privateBlobContainer: 'test-container',
			documents: [{ blobStoreUrl: '/test/blob/url' }]
		});
		blobClient.copyFile = jest.fn().mockResolvedValueOnce(false);

		await run(mockContext, mockMsg);

		expect(mockSendEvents).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				deadline: mockMsg.deadline,
				submissionType: mockMsg.submissionType,
				blobGuid: mockMsg.blobGuid,
				documentName: mockMsg.documentName
			})
		);
	});
});
