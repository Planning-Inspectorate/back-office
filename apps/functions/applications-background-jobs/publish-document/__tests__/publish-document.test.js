// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import { jest } from '@jest/globals';
import got from 'got';
import { index } from '../index.js';
import { blobClient } from '../blob-client.js';

const mock200Response = { json: jest.fn().mockResolvedValue({}) };

const mockCtx = {
	log: jest.fn()
};

beforeEach(() => {
	jest.clearAllMocks();
});

beforeAll(() => {
	jest.useFakeTimers('modern');
	jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
});

afterAll(() => {
	jest.useRealTimers();
});

describe('Publishing document', () => {
	const testCases = [
		{
			name: 'Missing extension is added from original filename',
			document: {
				caseId: 1,
				documentId: '6ef4b161-e930-4f5a-b789-c7a6352b7051',
				version: 1,
				documentReference: 'BC0110003-001',
				filename: 'olive oil',
				originalFilename: 'olive oil.jpeg',
				documentURI:
					'https://127.0.0.1:10000/document-service-uploads/application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1'
			},
			expectedSourceName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg'
		},
		{
			name: 'Matching extension is not changed',
			document: {
				caseId: 1,
				documentId: '6ef4b161-e930-4f5a-b789-c7a6352b7051',
				version: 1,
				documentReference: 'BC0110003-001',
				filename: 'olive oil.jpeg',
				originalFilename: 'olive oil.jpeg',
				documentURI:
					'https://127.0.0.1:10000/document-service-uploads/application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1'
			},
			expectedSourceName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg'
		},
		{
			name: 'Mismatching extension is maintained and original extension is added',
			document: {
				caseId: 1,
				documentId: '6ef4b161-e930-4f5a-b789-c7a6352b7051',
				version: 1,
				documentReference: 'BC0110003-001',
				filename: 'olive oil.jpeg',
				originalFilename: 'olive oil.png',
				documentURI:
					'https://127.0.0.1:10000/document-service-uploads/application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1'
			},
			expectedSourceName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/1',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg.png'
		}
	];

	it.each(testCases)('$name', async ({ document, expectedSourceName, expectedDestinationName }) => {
		// Arrange
		const mockGotPost = jest.spyOn(got, 'post');
		const mockCopyFile = jest.spyOn(blobClient, 'copyFile');

		mockGotPost.mockReturnValue(mock200Response);
		mockCopyFile.mockImplementation();

		jest.spyOn(Date, 'now').mockReturnValueOnce(1000);

		// Act
		await index(mockCtx, document);

		// Assert
		expect(mockCopyFile).toHaveBeenNthCalledWith(1, {
			sourceContainerName: 'document-service-uploads',
			sourceBlobName: expectedSourceName,
			destinationContainerName: 'published-documents',
			destinationBlobName: expectedDestinationName
		});

		expect(mockGotPost).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/${document.caseId}/documents/${document.documentId}/version/${document.version}/mark-as-published`,
			{
				json: {
					publishedBlobPath: expectedDestinationName,
					publishedBlobContainer: 'published-documents',
					publishedDate: new Date('2023-01-01T00:00:00Z')
				}
			}
		);
	});
});
