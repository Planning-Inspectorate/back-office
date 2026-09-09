// @ts-nocheck
import { jest } from '@jest/globals';
import { requestWithApiKey } from '../../common/backend-api-request.js';
import { index } from '../index.js';
import { blobClient } from '../../common/blob-client.js';
import { createMockContext } from '../../common/__tests__/test-utils/mock-context.js';
import {
	TEST_API_HOST,
	TEST_BLOB_ACCOUNT,
	TEST_BLOB_PUBLISH_CONTAINER
} from '../../common/__tests__/test-utils/test-constants.js';

const mockContext = createMockContext();

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Unpublishing document', () => {
	const baseDocumentProperties = {
		caseId: 1,
		documentId: 'a12b3d4a-a123-123a-1a2b-12345abc1abc',
		version: 1
	};

	describe('when unpublishing succeeds', () => {
		it('deletes the published blob and calls mark-as-unpublished when a publishedDocumentURI is provided', async () => {
			const mockGotPost = jest.spyOn(requestWithApiKey, 'post');
			const mockDeleteBlob = jest.spyOn(blobClient, 'deleteBlobIfExists');

			mockGotPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
			mockDeleteBlob.mockResolvedValue();

			const document = {
				...baseDocumentProperties,
				publishedDocumentURI: `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_PUBLISH_CONTAINER}/some-file.pdf`
			};

			await index(mockContext, document);

			expect(mockDeleteBlob).toHaveBeenCalledTimes(1);
			expect(mockGotPost).toHaveBeenCalledTimes(1);
			expect(mockGotPost).toHaveBeenCalledWith(
				`https://${TEST_API_HOST}/applications/${document.caseId}/documents/${document.documentId}/version/${document.version}/mark-as-unpublished`
			);
		});

		it('skips blob deletion and still calls mark-as-unpublished when publishedDocumentURI is null', async () => {
			const mockGotPost = jest.spyOn(requestWithApiKey, 'post');
			const mockDeleteBlob = jest.spyOn(blobClient, 'deleteBlobIfExists');

			mockGotPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

			const document = {
				...baseDocumentProperties,
				publishedDocumentURI: null
			};

			await index(mockContext, document);

			expect(mockDeleteBlob).not.toHaveBeenCalled();
			expect(mockGotPost).toHaveBeenCalledTimes(1);
			expect(mockGotPost).toHaveBeenCalledWith(
				`https://${TEST_API_HOST}/applications/${document.caseId}/documents/${document.documentId}/version/${document.version}/mark-as-unpublished`
			);
		});
	});

	describe('required properties', () => {
		it('still throws if caseId, documentId or version are missing, regardless of publishedDocumentURI', async () => {
			const document = {
				caseId: undefined,
				documentId: 'a12b3d4a-a123-123a-1a2b-12345abc1abc',
				version: 1,
				publishedDocumentURI: null
			};

			await expect(index(mockContext, document)).rejects.toThrow(
				'One or more required properties are missing'
			);
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('One or more required properties are missing')
			);
		});
	});

	describe('when deleting the published blob fails', () => {
		it('logs an error and throws when deleting the published blob fails', async () => {
			const mockDeleteBlob = jest.spyOn(blobClient, 'deleteBlobIfExists');
			mockDeleteBlob.mockRejectedValue(new Error('storage unavailable'));

			const document = {
				...baseDocumentProperties,
				publishedDocumentURI: `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_PUBLISH_CONTAINER}/some-file.pdf`
			};

			await expect(index(mockContext, document)).rejects.toThrow('storage unavailable');
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('encountered error while unpublishing document ID')
			);
		});
	});

	describe('when the mark-as-unpublished API call fails', () => {
		it('logs an error before throwing when mark-as-unpublished fails', async () => {
			const mockGotPost = jest.spyOn(requestWithApiKey, 'post');
			mockGotPost.mockReturnValue({
				json: jest.fn().mockRejectedValue(new Error('network error'))
			});

			const document = {
				...baseDocumentProperties,
				publishedDocumentURI: null
			};

			await expect(index(mockContext, document)).rejects.toThrow('network error');
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('encountered error while calling mark-as-unpublished')
			);
		});
	});
});
