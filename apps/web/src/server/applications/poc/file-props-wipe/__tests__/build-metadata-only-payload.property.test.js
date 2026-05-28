// @ts-nocheck
import { jest } from '@jest/globals';
import fc from 'fast-check';

// Mock the service module to avoid config/network dependencies
await jest.unstable_mockModule(
	'./src/server/applications/poc/file-props-wipe/file-props-wipe-poc.service.js',
	() => ({
		uploadDocument: jest.fn(),
		getDocumentProperties: jest.fn(),
		updateDocumentProperties: jest.fn()
	})
);

const { buildMetadataOnlyPayload } = await import('../file-props-wipe-poc.controller.js');

/**
 * Property 1: Update payload excludes all blob fields
 *
 * For any document version record (with arbitrary field values), the
 * buildMetadataOnlyPayload function SHALL produce an output object that
 * contains none of the blob field keys (privateBlobPath, privateBlobContainer,
 * size, mime, originalFilename).
 *
 * **Validates: Requirements 4.1, 4.2**
 */
describe('buildMetadataOnlyPayload - Property 1: Update payload excludes all blob fields', () => {
	const BLOB_FIELDS = [
		'privateBlobPath',
		'privateBlobContainer',
		'size',
		'mime',
		'originalFilename'
	];

	/** Arbitrary that produces nullable scalar values typical of document version records */
	const scalarArb = fc.oneof(
		fc.string(),
		fc.integer(),
		fc.constant(null),
		fc.constant(undefined),
		fc.boolean()
	);

	/**
	 * Arbitrary that generates a document version record with a mix of blob fields,
	 * metadata fields, and arbitrary extra fields.
	 */
	const documentVersionArb = fc
		.record({
			// Blob fields (may or may not be present)
			privateBlobPath: fc.option(fc.string(), { nil: undefined }),
			privateBlobContainer: fc.option(fc.string(), { nil: undefined }),
			size: fc.option(fc.integer({ min: 0 }), { nil: undefined }),
			mime: fc.option(fc.string(), { nil: undefined }),
			originalFilename: fc.option(fc.string(), { nil: undefined }),
			// Common metadata fields
			description: fc.option(fc.string(), { nil: undefined }),
			author: fc.option(fc.string(), { nil: undefined }),
			documentGuid: fc.option(fc.string(), { nil: undefined }),
			version: fc.option(fc.integer({ min: 1 }), { nil: undefined })
		})
		.chain((base) =>
			// Add arbitrary extra fields to simulate unknown/future fields
			fc
				.dictionary(fc.string({ minLength: 1, maxLength: 15 }), scalarArb, { maxKeys: 5 })
				.map((extra) => ({ ...base, ...extra }))
		);

	it('should never include any blob field keys in the output payload', () => {
		fc.assert(
			fc.property(documentVersionArb, (currentVersion) => {
				const payload = buildMetadataOnlyPayload(currentVersion);

				for (const blobField of BLOB_FIELDS) {
					expect(payload).not.toHaveProperty(blobField);
				}
			}),
			{ numRuns: 500 }
		);
	});

	it('should exclude blob fields even when the input contains only blob fields', () => {
		const blobOnlyArb = fc.record({
			privateBlobPath: fc.string(),
			privateBlobContainer: fc.string(),
			size: fc.integer({ min: 0 }),
			mime: fc.string(),
			originalFilename: fc.string()
		});

		fc.assert(
			fc.property(blobOnlyArb, (currentVersion) => {
				const payload = buildMetadataOnlyPayload(currentVersion);

				for (const blobField of BLOB_FIELDS) {
					expect(payload).not.toHaveProperty(blobField);
				}
			}),
			{ numRuns: 200 }
		);
	});
});
