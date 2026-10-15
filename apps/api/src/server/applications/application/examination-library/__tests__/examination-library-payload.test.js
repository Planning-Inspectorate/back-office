// @ts-nocheck
import {
	buildExaminationLibraryPublishPayload,
	buildExaminationLibraryUnpublishPayload
} from '#infrastructure/payload-builders/examination-library.js';

describe('Examination Library Payload Builders', () => {
	describe('buildExaminationLibraryPublishPayload', () => {
		const validPublishedCategory = {
			caseId: 1,
			caseReference: 'EN010001',
			documents: [
				{
					guid: 'doc-123',
					latestDocumentVersion: {
						examinationRefNo: 'APP-001',
						ExaminationLibraryCategory: {
							categoryCode: 'APP',
							categoryName: 'Application form'
						}
					}
				}
			]
		};

		it('should build publish payload with valid inputs', () => {
			const payload = buildExaminationLibraryPublishPayload(validPublishedCategory);

			expect(payload).toEqual({
				caseReference: 'EN010001',
				examinationDocuments: [
					{
						documentGuid: 'doc-123',
						documentExaminationReference: 'APP-001',
						categoryCode: 'APP',
						categoryName: 'Application form'
					}
				]
			});
		});

		it('should throw an error if caseReference is missing', () => {
			expect(() =>
				buildExaminationLibraryPublishPayload({
					documents: validPublishedCategory.documents
				})
			).toThrow('Case reference is required for examination library publish payload');
		});

		it('should throw an error if documents array is empty', () => {
			expect(() =>
				buildExaminationLibraryPublishPayload({
					caseReference: 'EN010001',
					documents: []
				})
			).toThrow(
				'At least one examination document is required for examination library publish payload'
			);
		});

		it('should throw an error if document is missing required properties', () => {
			const invalidCategory = {
				caseReference: 'EN010001',
				documents: [
					{
						guid: 'doc-123',
						latestDocumentVersion: {
							examinationRefNo: null,
							ExaminationLibraryCategory: {
								categoryCode: 'APP',
								categoryName: 'Application form'
							}
						}
					}
				]
			};

			expect(() => buildExaminationLibraryPublishPayload(invalidCategory)).toThrow(
				'Document doc-123 is missing required properties (documentExaminationReference) for examination library publishing'
			);
		});
	});

	describe('buildExaminationLibraryUnpublishPayload', () => {
		it('should build unpublish payload with valid inputs', () => {
			const payload = buildExaminationLibraryUnpublishPayload({
				caseId: 1,
				caseReference: 'EN010001',
				categories: ['APP']
			});

			expect(payload).toEqual({
				caseReference: 'EN010001',
				categories: ['APP']
			});
		});

		it('should throw an error if caseReference is missing', () => {
			expect(() =>
				buildExaminationLibraryUnpublishPayload({
					categories: ['APP']
				})
			).toThrow('Case reference and categories are required for unpublish payload');
		});

		it('should throw an error if categories array is empty', () => {
			expect(() =>
				buildExaminationLibraryUnpublishPayload({
					caseReference: 'EN010001',
					categories: []
				})
			).toThrow('Case reference and categories are required for unpublish payload');
		});
	});
});
