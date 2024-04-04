// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import { jest } from '@jest/globals';
import { requestWithApiKey } from '../../common/backend-api-request.js';
import { index } from '../index.js';
import { blobClient } from '../../common/blob-client.js';
import { stringToStream } from '../../common/__tests__/test-utils/string-to-stream.js';
import { createTestYoutubeTemplate } from '../../common/__tests__/test-utils/test-html.js';
import {
	TEST_API_HOST,
	TEST_BLOB_ACCOUNT,
	TEST_BLOB_FILE_NAME,
	TEST_BLOB_GUID,
	TEST_BLOB_PUBLISH_CONTAINER,
	TEST_BLOB_SOURCE_CONTAINER,
	TEST_BLOB_VERSION,
	TEST_CASE_REFERENCE
} from '../../common/__tests__/test-utils/test-constants.js';

const mock200Response = { json: jest.fn().mockResolvedValue({}) };
const mockContext = {
	log: jest.fn()
};
mockContext.log.info = jest.fn();
const mockSystemTime = new Date('2023-01-01T00:00:00.000Z');

beforeEach(() => {
	jest.clearAllMocks();
});

beforeAll(() => {
	jest.useFakeTimers({ doNotFake: ['performance'] });
	jest.setSystemTime(mockSystemTime);
});

afterAll(() => {
	jest.useRealTimers();
});

describe('Publishing document', () => {
	const baseDocumentProperties = {
		caseId: 1,
		documentId: TEST_BLOB_GUID,
		version: 1,
		documentReference: `${TEST_CASE_REFERENCE}-001`,
		filename: TEST_BLOB_FILE_NAME,
		originalFilename: `${TEST_BLOB_FILE_NAME}.jpeg`,
		documentURI: `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_SOURCE_CONTAINER}/application/${TEST_CASE_REFERENCE}/${TEST_BLOB_GUID}/${TEST_BLOB_VERSION}`
	};
	const baseTestCaseProperties = {
		blobName: `application/${TEST_CASE_REFERENCE}/${TEST_BLOB_GUID}/${TEST_BLOB_VERSION}`,
		blobPropertiesContentType: 'image/png',
		isHtml: false
	};

	const testCases = [
		{
			name: 'Missing extension is added from original filename',
			document: {
				...baseDocumentProperties,
				filename: TEST_BLOB_FILE_NAME,
				originalFilename: `${TEST_BLOB_FILE_NAME}.jpeg`
			},
			...baseTestCaseProperties,
			expectedDestinationName: `${TEST_CASE_REFERENCE}-001-${TEST_BLOB_FILE_NAME}.jpeg`
		},
		{
			name: 'Matching extension is not changed',
			document: {
				...baseDocumentProperties,
				filename: `${TEST_BLOB_FILE_NAME}.jpeg`,
				originalFilename: `${TEST_BLOB_FILE_NAME}.jpeg`
			},
			...baseTestCaseProperties,
			expectedDestinationName: `${TEST_CASE_REFERENCE}-001-${TEST_BLOB_FILE_NAME}.jpeg`
		},
		{
			name: 'Mismatching extension is maintained and original extension is added',
			document: {
				...baseDocumentProperties,
				filename: `${TEST_BLOB_FILE_NAME}.jpeg`,
				originalFilename: `${TEST_BLOB_FILE_NAME}.png`
			},
			...baseTestCaseProperties,
			expectedDestinationName: `${TEST_CASE_REFERENCE}-001-${TEST_BLOB_FILE_NAME}.jpeg.png`
		},
		{
			name: 'HTML files are validated properly',
			document: {
				...baseDocumentProperties,
				filename: `${TEST_BLOB_FILE_NAME}.html`,
				originalFilename: `${TEST_BLOB_FILE_NAME}.html`
			},
			...baseTestCaseProperties,
			blobPropertiesContentType: 'text/html',
			expectedDestinationName: `${TEST_CASE_REFERENCE}-001-${TEST_BLOB_FILE_NAME}.html`,
			isHtml: true
		},
		{
			name: 'Horizon specific blob path is handled',
			document: {
				...baseDocumentProperties,
				documentURI:
					// typical blob path for migration docs look like: /${caseference}/horizonweb:${guid}:${version}
					`https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_SOURCE_CONTAINER}/${TEST_CASE_REFERENCE}/horizonweb:${TEST_BLOB_GUID}:${TEST_BLOB_VERSION}`
			},
			...baseTestCaseProperties,
			blobName: `${TEST_CASE_REFERENCE}/horizonweb:${TEST_BLOB_GUID}:${TEST_BLOB_VERSION}`,
			expectedDestinationName: `${TEST_CASE_REFERENCE}-001-${TEST_BLOB_FILE_NAME}.jpeg`
		}
	];

	it.each(testCases)(
		'$name',
		async ({ document, blobName, blobPropertiesContentType, expectedDestinationName, isHtml }) => {
			// Arrange
			const mockGotPost = jest.spyOn(requestWithApiKey, 'post');
			const mockCopyFile = jest.spyOn(blobClient, 'copyFileFromUrl');
			const mockDownloadStream = jest.spyOn(blobClient, 'downloadStream');
			const mockGetBlobProperties = jest.spyOn(blobClient, 'getBlobProperties');

			mockGotPost.mockReturnValue(mock200Response);
			mockCopyFile.mockImplementation();
			mockGetBlobProperties.mockResolvedValue({ contentType: blobPropertiesContentType });
			mockDownloadStream.mockResolvedValue({
				readableStreamBody: stringToStream(createTestYoutubeTemplate())
			});

			jest.spyOn(Date, 'now').mockReturnValueOnce(1000);

			// Act
			await index(mockContext, document);

			// Assert
			expect(mockGetBlobProperties).toHaveBeenCalledTimes(1);
			expect(mockGetBlobProperties).toHaveBeenCalledWith(TEST_BLOB_SOURCE_CONTAINER, blobName);
			expect(mockDownloadStream).toHaveBeenCalledTimes(Number(isHtml)); // true = 1 | false = 0
			expect(mockCopyFile).toHaveBeenCalledTimes(1);
			expect(mockCopyFile).toHaveBeenCalledWith({
				sourceUrl: document.documentURI,
				destinationContainerName: TEST_BLOB_PUBLISH_CONTAINER,
				destinationBlobName: expectedDestinationName
			});
			expect(mockGotPost).toHaveBeenCalledTimes(1);
			expect(mockGotPost).toHaveBeenCalledWith(
				`https://${TEST_API_HOST}/applications/${document.caseId}/documents/${document.documentId}/version/${document.version}/mark-as-published`,
				{
					json: {
						publishedBlobPath: expectedDestinationName,
						publishedBlobContainer: TEST_BLOB_PUBLISH_CONTAINER,
						publishedDate: mockSystemTime
					}
				}
			);
		}
	);
});
