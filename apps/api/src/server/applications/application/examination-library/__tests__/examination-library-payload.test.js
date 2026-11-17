// @ts-nocheck
import {
	buildExaminationLibraryPublishPayload,
	buildExaminationLibraryUnpublishPayload,
	validateExaminationLibraryPublishPayload,
	validateExaminationLibraryUnpublishPayload
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

		it('should throw an error if documents are not provided or empty', () => {
			expect(() =>
				buildExaminationLibraryPublishPayload({
					caseReference: 'EN010001'
				})
			).toThrow(
				'At least one examination document is required for examination library publish payload'
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
	});

	describe('validateExaminationLibraryPublishPayload', () => {
		const validPayload = {
			caseReference: 'EN010001',
			examinationDocuments: [
				{
					documentGuid: 'doc-123',
					documentExaminationReference: 'APP-001',
					categoryCode: 'APP',
					categoryName: 'Application form'
				}
			]
		};

		it('should return valid payload if structure is 100% correct', () => {
			expect(validateExaminationLibraryPublishPayload(validPayload)).toEqual(validPayload);
		});

		it('should throw an error if payload is not an object', () => {
			expect(() => validateExaminationLibraryPublishPayload(null)).toThrow(
				'Examination library publish payload must be an object'
			);
			expect(() => validateExaminationLibraryPublishPayload([])).toThrow(
				'Examination library publish payload must be an object'
			);
		});

		it('should throw an error if caseReference is missing or empty', () => {
			expect(() =>
				validateExaminationLibraryPublishPayload({
					...validPayload,
					caseReference: ''
				})
			).toThrow('Case reference is required for examination library publish payload');
		});

		it('should throw an error if examinationDocuments is not an array or empty', () => {
			expect(() =>
				validateExaminationLibraryPublishPayload({
					...validPayload,
					examinationDocuments: []
				})
			).toThrow(
				'At least one examination document is required for examination library publish payload'
			);
		});

		it('should throw an error if an examinationDocument item is not an object', () => {
			expect(() =>
				validateExaminationLibraryPublishPayload({
					caseReference: 'EN010001',
					examinationDocuments: [null]
				})
			).toThrow('Examination document at index 0 must be an object');
		});

		it('should throw an error if document has missing or empty required fields', () => {
			expect(() =>
				validateExaminationLibraryPublishPayload({
					caseReference: 'EN010001',
					examinationDocuments: [
						{
							documentGuid: 'doc-123',
							documentExaminationReference: '',
							categoryCode: 'APP',
							categoryName: 'Application form'
						}
					]
				})
			).toThrow(
				'Document doc-123 is missing required properties (documentExaminationReference) for examination library publishing'
			);
		});
	});

	describe('validateExaminationLibraryUnpublishPayload', () => {
		const validPayload = {
			caseReference: 'EN010001',
			categories: ['APP', 'REP1']
		};

		it('should return valid payload if structure is 100% correct', () => {
			expect(validateExaminationLibraryUnpublishPayload(validPayload)).toEqual(validPayload);
		});

		it('should throw an error if payload is not an object', () => {
			expect(() => validateExaminationLibraryUnpublishPayload(null)).toThrow(
				'Examination library unpublish payload must be an object'
			);
		});

		it('should throw an error if caseReference is missing or empty', () => {
			expect(() =>
				validateExaminationLibraryUnpublishPayload({
					caseReference: '',
					categories: ['APP']
				})
			).toThrow('Case reference and categories are required for unpublish payload');
		});

		it('should throw an error if categories is not an array or empty', () => {
			expect(() =>
				validateExaminationLibraryUnpublishPayload({
					caseReference: 'EN010001',
					categories: []
				})
			).toThrow('Case reference and categories are required for unpublish payload');
		});

		it('should throw an error if any category is not a string or empty', () => {
			expect(() =>
				validateExaminationLibraryUnpublishPayload({
					caseReference: 'EN010001',
					categories: ['APP', '']
				})
			).toThrow('Case reference and categories are required for unpublish payload');
		});
	});
});
