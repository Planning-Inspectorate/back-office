import { jest } from '@jest/globals';
import { fixtureReadyToPublishDocumentationPdfFile } from '../../../../../../testing/applications/fixtures/documentation-files.js';

await jest.unstable_mockModule('@pins/applications.web/environment/config.js', () => ({
	default: {
		azureAiDocRedactionBlobStorageName: 'test-storage'
	}
}));

const { buildAiRedactionPayload } = await import('../utils/build-ai-redaction-payload.js');

describe('buildAiRedactionPayload', () => {
	const baseDoc = {
		...fixtureReadyToPublishDocumentationPdfFile,
		version: 1,
		privateBlobPath: '/application/CASE1/guid-123/1',
		privateBlobContainer: 'blob-container'
	};

	it('sets storageName from config', () => {
		const payload = buildAiRedactionPayload(baseDoc, 'CASE1');

		expect(payload.readDetails.properties.storageName).toBe('test-storage');
		expect(payload.writeDetails.properties.storageName).toBe('test-storage');
	});

	it('throws if required blob info is missing', () => {
		expect(() =>
			buildAiRedactionPayload({ ...baseDoc, privateBlobPath: undefined }, 'CASE1')
		).toThrow('Document is missing required blob information for AI redaction.');
	});

	it('includes expected metadata fields', () => {
		const payload = buildAiRedactionPayload(baseDoc, 'CASE1');

		expect(payload.metadata).toMatchObject({
			documentGuid: '3',
			version: 1,
			caseRef: '',
			documentRef: undefined,
			folderId: 11,
			fileName: '4 Elit sed',
			originalFilename: '4 Elit sed'
		});
	});

	it('replaces the last path segment with expected new version number for destination blob path', () => {
		const payload = buildAiRedactionPayload(baseDoc, 'CASE1');

		expect(payload.writeDetails.properties.blobPath).toBe('application/CASE1/guid-123/2');
	});
});
