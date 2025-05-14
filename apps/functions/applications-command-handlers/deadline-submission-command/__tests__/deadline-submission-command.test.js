// @ts-nocheck
import run from '../';
import blobClient from '../blob-client';
import api from '../back-office-api-client';
import eventClient from '../event-client';
import { jest } from '@jest/globals';

describe('deadline-submission-command', () => {
	const mockSendEvents = jest.fn();

	beforeEach(() => {
		// assumptions:
		/* case id = 1
		 * exam timetable item id = 1
		 * exam item folder id = 1
		 * exam sub item folder id = 2
		 * unassigned folder id = 3
		 */
		api.getCaseID = jest.fn().mockResolvedValue(1);
		api.examTimetableItemFolderExists = jest.fn().mockResolvedValue(true);
		api.getExamTimetableLineItemFolderID = jest.fn().mockResolvedValue(2);
		// api.getOrCreateUnassignedFolderId = jest.fn().mockResolvedValue(3);

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
				folderID: 2,
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
