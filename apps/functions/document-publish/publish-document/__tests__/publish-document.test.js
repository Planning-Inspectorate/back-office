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

describe('Publishing document', () => {
	const testCases = [
		{
			name: 'Missing extension is added from original filename',
			document: {
				documentId: '6ef4b161-e930-4f5a-b789-c7a6352b7051',
				documentReference: 'BC0110003-001',
				filename: 'olive oil',
				originalFilename: 'olive oil.jpeg',
				privateBlobPath: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/olive oil'
			},
			expectedSourceName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/olive oil',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg'
		},
		{
			name: 'Matching extension is not changed',
			document: {
				documentId: '6ef4b161-e930-4f5a-b789-c7a6352b7051',
				documentReference: 'BC0110003-001',
				filename: 'olive oil.jpeg',
				originalFilename: 'olive oil.jpeg',
				privateBlobPath: '/application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/olive oil'
			},
			expectedSourceName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/olive oil',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg'
		},
		{
			name: 'Mismatching extension is maintained and original extension is added',
			document: {
				documentId: '6ef4b161-e930-4f5a-b789-c7a6352b7051',
				documentReference: 'BC0110003-001',
				filename: 'olive oil.jpeg',
				originalFilename: 'olive oil.png',
				privateBlobPath: '//application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/olive oil'
			},
			expectedSourceName: 'application/BC0110003/6ef4b161-e930-4f5a-b789-c7a6352b7051/olive oil',
			expectedDestinationName: 'BC0110003-001-olive oil.jpeg.png'
		}
	];

	it.each(testCases)('$name', async ({ document, expectedSourceName, expectedDestinationName }) => {
		// Arrange
		const mockGotPatch = jest.spyOn(got, 'patch');
		const mockCopyFile = jest.spyOn(blobClient, 'copyFile');

		mockGotPatch.mockReturnValue(mock200Response);
		mockCopyFile.mockImplementation();

		// Act
		await index(mockCtx, document);

		// Assert
		expect(mockCopyFile).toHaveBeenNthCalledWith(1, {
			sourceContainerName: 'source-container',
			sourceBlobName: expectedSourceName,
			destinationContainerName: 'publish-container',
			destinationBlobName: expectedDestinationName
		});

		expect(mockGotPatch).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/documents/${document.documentId}/status`,
			{
				json: {
					machineAction: 'published'
				}
			}
		);
	});
});
