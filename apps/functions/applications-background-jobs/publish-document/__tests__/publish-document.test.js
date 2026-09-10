// @ts-nocheck
// eslint-disable-next-line no-unused-vars
import { jest } from '@jest/globals';
import { requestWithApiKey } from '../../common/backend-api-request.js';
import { blobClient } from '../../common/blob-client.js';
import { stringToStream } from '../../common/__tests__/test-utils/string-to-stream.js';
import {
	createTestYoutubeTemplate,
	INVALID_HTML_STRING
} from '../../common/__tests__/test-utils/test-html.js';
import { createMockContext } from '../../common/__tests__/test-utils/mock-context.js';
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

const rebuildMasterGeoJson = jest.fn();
const masterGeojsonModulePath = new URL('../../common/master-geojson.js', import.meta.url).pathname;
await jest.unstable_mockModule(masterGeojsonModulePath, () => ({ rebuildMasterGeoJson }));

const { index } = await import('../index.js');

const mock200Response = { json: jest.fn().mockResolvedValue({}) };
const mockContext = createMockContext();
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

/**
 * Arranges the blobClient/requestWithApiKey spies with sensible happy-path defaults;
 * individual tests override whichever return value they need to exercise a different branch.
 */
const arrangeMocks = ({
	copyResult = 'success',
	blobPropertiesContentType = 'image/png',
	downloadStreamBody = createTestYoutubeTemplate()
} = {}) => {
	const mockGotPost = jest.spyOn(requestWithApiKey, 'post').mockReturnValue(mock200Response);
	const mockGotPatch = jest.spyOn(requestWithApiKey, 'patch').mockReturnValue(mock200Response);
	const mockCopyFile = jest.spyOn(blobClient, 'copyFileFromUrl').mockResolvedValue(copyResult);
	const mockDownloadStream = jest.spyOn(blobClient, 'downloadStream').mockResolvedValue({
		readableStreamBody: stringToStream(downloadStreamBody)
	});
	const mockGetBlobProperties = jest
		.spyOn(blobClient, 'getBlobProperties')
		.mockResolvedValue({ contentType: blobPropertiesContentType });

	return { mockGotPost, mockGotPatch, mockCopyFile, mockDownloadStream, mockGetBlobProperties };
};

describe('Publishing document', () => {
	const baseDocumentProperties = {
		caseId: 1,
		documentId: TEST_BLOB_GUID,
		version: 1,
		documentReference: `${TEST_CASE_REFERENCE}-001`,
		filename: TEST_BLOB_FILE_NAME,
		originalFilename: `${TEST_BLOB_FILE_NAME}.jpeg`,
		documentURI: `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_SOURCE_CONTAINER}/application/${TEST_CASE_REFERENCE}/${TEST_BLOB_GUID}/${TEST_BLOB_VERSION}`,
		mime: 'image/jpeg'
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
		},
		{
			name: 'Source URL with spaces is encoded before copy',
			document: {
				...baseDocumentProperties,
				documentURI: `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_SOURCE_CONTAINER}/application/${TEST_CASE_REFERENCE}/${TEST_BLOB_GUID}/my boundary.geojson`,
				filename: 'my boundary.geojson',
				originalFilename: 'my boundary.geojson',
				mime: 'application/geo+json'
			},
			...baseTestCaseProperties,
			blobName: `application/${TEST_CASE_REFERENCE}/${TEST_BLOB_GUID}/my boundary.geojson`,
			expectedDestinationName: `${TEST_CASE_REFERENCE}-001-my boundary.geojson`
		}
	];

	describe('when publishing succeeds', () => {
		it.each(testCases)(
			'$name',
			async ({
				document,
				blobName,
				blobPropertiesContentType,
				expectedDestinationName,
				isHtml
			}) => {
				const { mockGotPost, mockCopyFile, mockDownloadStream, mockGetBlobProperties } =
					arrangeMocks({ blobPropertiesContentType });

				await index(mockContext, document);

				expect(mockGetBlobProperties).toHaveBeenCalledTimes(1);
				expect(mockGetBlobProperties).toHaveBeenCalledWith(TEST_BLOB_SOURCE_CONTAINER, blobName);
				expect(mockDownloadStream).toHaveBeenCalledTimes(Number(isHtml)); // true = 1 | false = 0
				const expectedSourceUrl = new URL(document.documentURI).toString();
				expect(mockCopyFile).toHaveBeenCalledTimes(1);
				expect(mockCopyFile).toHaveBeenCalledWith({
					sourceUrl: expectedSourceUrl,
					destinationContainerName: TEST_BLOB_PUBLISH_CONTAINER,
					destinationBlobName: expectedDestinationName,
					newContentType: document.mime
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

		it('omits publishedDate when migrationPublishing binding data is set', async () => {
			const { mockGotPost } = arrangeMocks();
			const migrationContext = {
				...mockContext,
				bindingData: { applicationProperties: { migrationPublishing: true } }
			};

			await index(migrationContext, baseDocumentProperties);

			expect(mockGotPost).toHaveBeenCalledWith(expect.any(String), {
				json: {
					publishedBlobContainer: TEST_BLOB_PUBLISH_CONTAINER,
					publishedBlobPath: `${TEST_CASE_REFERENCE}-001-${TEST_BLOB_FILE_NAME}.jpeg`
				}
			});
		});
	});

	describe('required properties and HTML validity checks', () => {
		it('throws and logs an error when a required property is missing', async () => {
			const document = { ...baseDocumentProperties, caseId: undefined };

			await expect(index(mockContext, document)).rejects.toThrow(
				'One or more required properties are missing'
			);
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('One or more required properties are missing')
			);
		});

		it('throws and logs an error when the HTML validity check fails', async () => {
			arrangeMocks({
				blobPropertiesContentType: 'text/html',
				downloadStreamBody: INVALID_HTML_STRING
			});

			const document = {
				...baseDocumentProperties,
				// needs a document-service-uploads path so handleHtmlValidityFail can extract a guid
				documentURI: `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_SOURCE_CONTAINER}/document-service-uploads/application/${TEST_CASE_REFERENCE}/${TEST_BLOB_GUID}/${TEST_BLOB_VERSION}`,
				filename: `${TEST_BLOB_FILE_NAME}.html`,
				originalFilename: `${TEST_BLOB_FILE_NAME}.html`
			};

			await expect(index(mockContext, document)).rejects.toThrow('failing validity check');
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('failing validity check')
			);
		});
	});

	describe('when copying the file to the publish container fails', () => {
		it('throws and logs an error when the blob copy fails', async () => {
			const { mockGotPost, mockCopyFile } = arrangeMocks();
			const copyError = Object.assign(new Error('deserialisation failed'), {
				name: 'RestError',
				statusCode: 500
			});
			mockCopyFile.mockRejectedValue(copyError);

			await expect(index(mockContext, baseDocumentProperties)).rejects.toThrow(
				'encountered error while copying blob'
			);
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('encountered error while copying blob')
			);
			expect(mockGotPost).not.toHaveBeenCalled();
		});

		it('throws and logs an error when the blob copy resolves with a non-success status', async () => {
			const { mockGotPost } = arrangeMocks({ copyResult: 'failed' });

			await expect(index(mockContext, baseDocumentProperties)).rejects.toThrow(
				'blob copy did not succeed'
			);
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('copyStatus was "failed"')
			);
			expect(mockGotPost).not.toHaveBeenCalled();
		});
	});

	describe('when the mark-as-published API call fails', () => {
		it('throws and logs an error when the mark-as-published call fails', async () => {
			const { mockGotPost } = arrangeMocks();
			mockGotPost.mockImplementation(() => {
				throw new Error('request failed');
			});

			await expect(index(mockContext, baseDocumentProperties)).rejects.toThrow(
				'encountered error while calling mark-as-published'
			);
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('encountered error while calling mark-as-published')
			);
		});
	});

	describe('GIS boundary rebuild', () => {
		const gisMockResponse = {
			json: jest
				.fn()
				.mockResolvedValue({ documentType: 'GIS shapefile', mime: 'application/geo+json' })
		};

		it('rebuilds the master GeoJson after publishing a GIS boundary document', async () => {
			const { mockGotPost } = arrangeMocks();
			mockGotPost.mockReturnValue(gisMockResponse);

			await index(mockContext, baseDocumentProperties);

			expect(rebuildMasterGeoJson).toHaveBeenCalledTimes(1);
		});

		it('logs an error and does not rethrow when rebuilding the master GeoJson fails', async () => {
			const { mockGotPost } = arrangeMocks();
			mockGotPost.mockReturnValue(gisMockResponse);
			rebuildMasterGeoJson.mockRejectedValueOnce(new Error('rebuild failed'));

			await expect(index(mockContext, baseDocumentProperties)).resolves.toBeUndefined();
			expect(mockContext.log.error).toHaveBeenCalledWith(
				expect.stringContaining('Failed to rebuild master GeoJson')
			);
		});
	});
});
