import { jest } from '@jest/globals';
import {
	TEST_BLOB_ACCOUNT,
	TEST_BLOB_CONTAINER,
	TEST_BLOB_GUID
} from './test-utils/test-constants.js';
import { isScannedFileHtml, isUploadedHtmlValid } from '../html-validation.js';
import { Readable } from 'stream';
import { INVALID_HTML_STRING, createTestYoutubeTemplate } from './test-utils/test-html.js';
import { mockLogger } from '../../setup-tests.js';
import { blobClient } from '../blob-client.js';

const testBlobUri = `https://${TEST_BLOB_ACCOUNT}.blob.core.windows.net/${TEST_BLOB_CONTAINER}/path/to/blob/${TEST_BLOB_GUID}/1'`;
describe('isScannedFileHtml', () => {
	it.each([
		{ contentType: 'text/html', expectedResult: true },
		{ contentType: 'not text or html', expectedResult: false }
	])(
		'returns $expectedResult when the content type is $contentType',
		async ({ contentType, expectedResult }) => {
			jest.spyOn(blobClient, 'getBlobProperties').mockResolvedValue({ contentType });

			const result = await isScannedFileHtml(testBlobUri);

			expect(result).toBe(expectedResult);
		}
	);
});

describe('isUploadedHtmlValid', () => {
	/**
	 * @param {String} string
	 * @returns {Readable}
	 */
	const stringToStream = (string) => {
		const stream = new Readable();
		stream.push(string);
		stream.push(null);
		return stream;
	};

	it.each([
		{ youtubeLink: 'https://www.youtube.com/embed/VIDEO_ID', expectedResult: true },
		{ youtubeLink: 'https://youtu.be/VIDEO_ID', expectedResult: true },
		{ youtubeLink: 'https://im-an-invalid-link.com', expectedResult: false }
	])(
		'returns $expectedResult when html has link like `$youtubeLink`',
		async ({ youtubeLink, expectedResult }) => {
			const htmlFileAsStream = stringToStream(createTestYoutubeTemplate(youtubeLink));
			jest
				.spyOn(blobClient, 'downloadStream')
				.mockResolvedValue({ readableStreamBody: htmlFileAsStream });

			const result = await isUploadedHtmlValid(testBlobUri, mockLogger);

			expect(result).toBe(expectedResult);
		}
	);

	it('returns false when the downloaded html does not match template', async () => {
		const htmlFileAsStream = stringToStream(INVALID_HTML_STRING);
		jest
			.spyOn(blobClient, 'downloadStream')
			.mockResolvedValue({ readableStreamBody: htmlFileAsStream });

		const result = await isUploadedHtmlValid(testBlobUri, mockLogger);

		expect(result).toBe(false);
	});

	it('throws an error when blobClient.downloadStream does not return a readableStreamBody', async () => {
		jest.spyOn(blobClient, 'downloadStream').mockResolvedValue({});

		await expect(isUploadedHtmlValid(testBlobUri, mockLogger)).rejects.toThrow(
			'No file stream received after attempting to download from Blob Container'
		);
	});
});