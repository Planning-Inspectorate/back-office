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
		api.getTimetableItem = jest.fn().mockResolvedValue({
			id: 1,
			name: 'timetableItemName',
			nameWelsh: 'timetableItemName Welsh',
			description: '{"bulletPoints": ["Test submission type"]}',
			descriptionWelsh: '{"bulletPoints": ["Test submission type Welsh"]}'
		});
		api.populateDocumentMetadata = jest.fn();

		eventClient.publishFailureEvent = mockSendEvents;

		blobClient.getBlobProperties = jest.fn().mockResolvedValue({
			contentType: 'application/octet-stream',
			contentLength: 1
		});
	});

	const mockContext = { log: jest.fn() };
	const mockMsg = {
		caseReference: 'case-ref',
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
				description: mockMsg.submissionType,
				descriptionWelsh: 'Test submission type Welsh',
				filter1: mockMsg.deadline,
				filter1Welsh: 'timetableItemName Welsh',
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

		const success = await (async () => {
			try {
				await run(mockContext, mockMsg);
				return true;
			} catch (err) {
				return false;
			}
		})();

		expect(success).toBe(false);

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
