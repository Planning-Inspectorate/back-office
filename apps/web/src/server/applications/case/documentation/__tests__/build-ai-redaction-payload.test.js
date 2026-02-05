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
		privateBlobPath: '/application/CASE1/guid-123/1',
		privateBlobContainer: 'blob-container'
	};

	it('sets storageName from config', () => {
		const payload = buildAiRedactionPayload(baseDoc);

		expect(payload.readDetails.properties.storageName).toBe('test-storage');
		expect(payload.writeDetails.properties.storageName).toBe('test-storage');
	});

	it('throws if required blob info is missing', () => {
		expect(() => buildAiRedactionPayload({ ...baseDoc, privateBlobPath: undefined })).toThrow(
			'Document is missing required blob information for AI redaction.'
		);
	});

	it('includes expected metadata fields', () => {
		const payload = buildAiRedactionPayload(baseDoc);

		expect(payload.metadata).toMatchObject({
			documentGuid: '3',
			version: undefined,
			caseRef: '',
			documentRef: undefined,
			folderId: 11,
			fileName: '4 Elit sed',
			originalFilename: '4 Elit sed'
		});
	});

	it('replaces the last path segment with a timestamp for destination blob path', () => {
		jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

		const payload = buildAiRedactionPayload(baseDoc);

		expect(payload.writeDetails.properties.blobPath).toBe(
			'/application/CASE1/guid-123/1767225600000'
		);

		jest.useRealTimers();
	});
});
