// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import { jest } from '@jest/globals';
import { requestWithApiKey } from '../../common/backend-api-request.js';
import { index } from '../index.js';
import { blobClient } from '../../common/blob-client.js';
import { stringToStream } from '../../common/__tests__/test-utils/string-to-stream.js';
import { createTestYoutubeTemplate } from '../../common/__tests__/test-utils/test-html.js';

const mock200Response = { json: jest.fn().mockResolvedValue({}) };

const mockContext = {
	log: jest.fn()
};
mockContext.log.info = jest.fn();

beforeEach(() => {
	jest.clearAllMocks();
});

beforeAll(() => {
	jest.useFakeTimers({ doNotFake: ['performance'] });
	jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
});

afterAll(() => {
	jest.useRealTimers();
});

describe('Publishing document', () => {
	const baseDocumentProperties = {
		caseId: 1,
		documentId: '6ef4b161-e930-4f5a-b789-c7a6352b7051',
		version: 1,
		documentReference: 'BC0110003-001',
		filename: 'olive oil',
		originalFilename: 'olive oil.jpeg',
		documentURI:
			'https://127.0.0.1:10000/document-service-uploads/application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1'
	};
	const testCases = [
		{
			name: 'Missing extension is added from original filename',
			document: {
				...baseDocumentProperties,
				filename: 'olive oil',
				originalFilename: 'olive oil.jpeg'
			},
			blobName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1',
			blobPropertiesContentType: 'image/png',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg',
			isHtml: false
		},
		{
			name: 'Matching extension is not changed',
			document: {
				...baseDocumentProperties,
				filename: 'olive oil.jpeg',
				originalFilename: 'olive oil.jpeg'
			},
			blobName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1',
			blobPropertiesContentType: 'image/png',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg',
			isHtml: false
		},
		{
			name: 'Mismatching extension is maintained and original extension is added',
			document: {
				...baseDocumentProperties,
				filename: 'olive oil.jpeg',
				originalFilename: 'olive oil.png'
			},
			blobName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1',
			blobPropertiesContentType: 'image/png',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg.png',
			isHtml: false
		},
		{
			name: 'HTML files are validated properly',
			document: {
				...baseDocumentProperties,
				filename: 'olive oil.html',
				originalFilename: 'olive oil.html'
			},
			blobName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1',
			blobPropertiesContentType: 'text/html',
			expectedDestinationName: 'BC0110003-001-olive oil.html',
			isHtml: true
		},
		{
			name: 'Horizon specific blob path is handled',
			document: {
				...baseDocumentProperties,
				documentURI:
					// typical blob path for migration docs look like: /${caseference}/horizonweb:${guid}:${version}
					'https://127.0.0.1:10000/BC0110003/horizonweb:6ef4b161-e930-4f5a-b789-c7a6352b7051:1'
			},
			blobName: 'BC0110003/horizonweb:6ef4b161-e930-4f5a-b789-c7a6352b7051:1',
			blobPropertiesContentType: 'image/png',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg',
			isHtml: false
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
			expect(mockGetBlobProperties).toHaveBeenCalledWith('document-service-uploads', blobName);
			expect(mockDownloadStream).toHaveBeenCalledTimes(Number(isHtml));
			expect(mockCopyFile).toHaveBeenCalledTimes(1);
			expect(mockCopyFile).toHaveBeenCalledWith({
				sourceUrl: document.documentURI,
				destinationContainerName: 'published-documents',
				destinationBlobName: expectedDestinationName
			});
			expect(mockGotPost).toHaveBeenCalledTimes(1);
			expect(mockGotPost).toHaveBeenCalledWith(
				`https://test-api-host:3000/applications/${document.caseId}/documents/${document.documentId}/version/${document.version}/mark-as-published`,
				{
					json: {
						publishedBlobPath: expectedDestinationName,
						publishedBlobContainer: 'published-documents',
						publishedDate: new Date('2023-01-01T00:00:00Z')
					}
				}
			);
		}
	);
});
