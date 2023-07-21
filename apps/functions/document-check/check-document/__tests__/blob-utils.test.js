// @ts-nocheck
import { parseBlobFromUrl } from '../blob-utils.js';

describe('parseBlobFromUrl', () => {
	test('Correctly formatted blob URL is parsed to its storage url, container and blob path', async () => {
		// GIVEN
		const input =
			'https://pinsstdocsbodevukw001.blob.core.windows.net/document-service-uploads/application/WS0110004/b822d1f4-c48a-4004-9b80-0a12ae409ee9/1/sample-doc';

		// WHEN
		const result = parseBlobFromUrl(input);

		// THEN
		expect(result).toEqual({
			storageUrl: 'https://pinsstdocsbodevukw001.blob.core.windows.net',
			container: 'document-service-uploads',
			blobPath: 'application/WS0110004/b822d1f4-c48a-4004-9b80-0a12ae409ee9/sample-doc'
		});
	});
	test('Invalid blob URL is not parsed', async () => {
		// GIVEN
		const input = 'https://google.com/not/valid/input';

		// WHEN
		const result = parseBlobFromUrl(input);

		// THEN
		expect(result).toBeUndefined();
	});
});
