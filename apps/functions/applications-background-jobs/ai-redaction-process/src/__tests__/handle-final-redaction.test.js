// @ts-nocheck
import { jest } from '@jest/globals';

import { handleFinalRedaction } from '../handle-final-redaction.js';
import { requestWithApiKey } from '../../../common/backend-api-request.js';

jest.spyOn(requestWithApiKey, 'post');

const mockContext = {
	log: jest.fn()
};

beforeEach(() => {
	jest.clearAllMocks();

	requestWithApiKey.post.mockReturnValue({
		json: jest.fn()
	});
});

describe('handleFinalRedaction', () => {
	const baseMessage = {
		status: 'SUCCESS',
		parameters: {
			metadata: {
				caseId: 1,
				documentGuid: 'guid-123',
				folderId: 100,
				originalFilename: 'test_Redaction_Suggestions.pdf',
				mime: 'application/pdf',
				size: 200,
				documentRef: 'REF-001'
			},
			writeDetails: {
				properties: {
					blobPath: 'application/test/guid-123/3'
				}
			}
		}
	};

	it('throws if metadata is missing', async () => {
		const message = { parameters: {} };

		await expect(handleFinalRedaction(mockContext, message)).rejects.toThrow(
			'Missing metadata in redaction message'
		);
	});

	it('throws if caseId or documentGuid missing', async () => {
		const message = {
			parameters: {
				metadata: {}
			}
		};

		await expect(handleFinalRedaction(mockContext, message)).rejects.toThrow(
			'Missing caseId or documentGuid'
		);
	});

	it('sets ai_redaction_failed when status is not SUCCESS', async () => {
		const message = {
			...baseMessage,
			status: 'FAILED'
		};

		await handleFinalRedaction(mockContext, message);

		expect(requestWithApiKey.post).toHaveBeenCalledTimes(1);

		expect(requestWithApiKey.post).toHaveBeenCalledWith(expect.stringContaining('/metadata'), {
			json: {
				redactedStatus: 'ai_redaction_failed'
			}
		});
	});

	it('throws if blobPath is missing', async () => {
		const message = {
			...baseMessage,
			parameters: {
				...baseMessage.parameters,
				writeDetails: {}
			}
		};

		await expect(handleFinalRedaction(mockContext, message)).rejects.toThrow(
			'Missing writeDetails blobPath'
		);
	});

	it('runs successful final redaction workflow', async () => {
		await handleFinalRedaction(mockContext, baseMessage);

		expect(requestWithApiKey.post).toHaveBeenCalledTimes(3);

		// Step 1: mark previous version as reviewed
		expect(requestWithApiKey.post).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('/metadata'),
			{
				json: {
					redactedStatus: 'ai_suggestions_reviewed'
				}
			}
		);

		// Step 2: create new redacted version
		expect(requestWithApiKey.post).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('/add-version'),
			{
				json: expect.objectContaining({
					documentName: 'test_Redacted.pdf',
					folderId: 100,
					documentType: 'application/pdf',
					documentSize: 200,
					username: 'Redaction tool',
					documentReference: 'REF-001',
					privateBlobPath: '/application/test/guid-123/3'
				})
			}
		);

		// Step 3: update new version status
		expect(requestWithApiKey.post).toHaveBeenNthCalledWith(
			3,
			expect.stringContaining('/metadata'),
			{
				json: {
					redactedStatus: 'redacted'
				}
			}
		);
	});
});
