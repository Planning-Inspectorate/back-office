// @ts-nocheck
import { jest } from '@jest/globals';

import { handleSuggestions } from '../handle-suggestions.js';
import { requestWithApiKey } from '../../../common/backend-api-request.js';

jest.spyOn(requestWithApiKey, 'post');

const mockContext = {
	log: jest.fn()
};

const mockJson = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();

	requestWithApiKey.post.mockReturnValue({
		json: mockJson
	});
});

describe('handleSuggestions', () => {
	const baseMessage = {
		status: 'SUCCESS',
		parameters: {
			metadata: {
				caseId: 1,
				documentGuid: 'guid-123',
				folderId: 100,
				originalFilename: 'test.pdf',
				mime: 'application/pdf',
				size: 200,
				documentRef: 'REF-001'
			},
			writeDetails: {
				properties: {
					blobPath: 'application/test/guid-123/2'
				}
			}
		}
	};

	it('throws if metadata is missing', async () => {
		const message = { parameters: {} };

		await expect(handleSuggestions(mockContext, message)).rejects.toThrow(
			'Missing metadata in redaction message'
		);
	});

	it('throws if caseId or documentGuid missing', async () => {
		const message = {
			parameters: {
				metadata: {}
			}
		};

		await expect(handleSuggestions(mockContext, message)).rejects.toThrow(
			'Missing caseId or documentGuid'
		);
	});

	it('sets ai_redaction_failed when status is not SUCCESS', async () => {
		const message = {
			...baseMessage,
			status: 'FAILED'
		};

		await handleSuggestions(mockContext, message);

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

		await expect(handleSuggestions(mockContext, message)).rejects.toThrow(
			'Missing writeDetails blobPath'
		);
	});

	it('runs successful suggestion workflow', async () => {
		await handleSuggestions(mockContext, baseMessage);

		expect(requestWithApiKey.post).toHaveBeenCalledTimes(3);

		// Step 1: reset previous version status
		expect(requestWithApiKey.post).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('/metadata'),
			{
				json: {
					redactedStatus: 'not_redacted'
				}
			}
		);

		// Step 2: create new document version
		expect(requestWithApiKey.post).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('/add-version'),
			{
				json: expect.objectContaining({
					documentName: 'test_Redaction_Suggestions.pdf',
					folderId: 100,
					documentType: 'application/pdf',
					documentSize: 200,
					username: 'Redaction tool',
					documentReference: 'REF-001',
					privateBlobPath: '/application/test/guid-123/2'
				})
			}
		);

		// Step 3: update new version status
		expect(requestWithApiKey.post).toHaveBeenNthCalledWith(
			3,
			expect.stringContaining('/metadata'),
			{
				json: {
					redactedStatus: 'ai_suggestions_review_required'
				}
			}
		);
	});
});
