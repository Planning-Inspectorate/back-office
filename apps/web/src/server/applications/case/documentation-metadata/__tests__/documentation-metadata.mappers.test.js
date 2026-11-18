//@ts-nocheck
import { mapMetadataFormToApi } from '../documentation-metadata.mappers.js';

describe('mapMetadataFormToApi', () => {
	describe('examination library category', () => {
		it('maps a standard category to the examination library category id', () => {
			const body = {
				examinationLibraryCategoryId: '10'
			};

			expect(mapMetadataFormToApi('examination-library-category', body)).toEqual({
				examinationLibraryCategoryId: 10
			});
		});

		it('maps the selected APP child to the examination library category id', () => {
			const body = {
				examinationLibraryCategoryId: 'APP',
				examinationLibraryCategoryChild: '7'
			};

			expect(mapMetadataFormToApi('examination-library-category', body)).toEqual({
				examinationLibraryCategoryId: 7
			});
		});
	});

	describe('examination library reference', () => {
		it('maps an automatic reference to null', () => {
			const body = {
				examinationLibraryReferenceType: 'automatic'
			};

			expect(mapMetadataFormToApi('examination-library-reference', body)).toEqual({
				examinationRefNo: null
			});
		});

		it('maps a manual reference with the examination library category prefix', () => {
			const body = {
				examinationLibraryReferenceType: 'manual',
				examinationRefNo: '004a'
			};

			const documentMetaData = {
				examinationLibraryCategoryCode: 'APP'
			};

			expect(mapMetadataFormToApi('examination-library-reference', body, documentMetaData)).toEqual(
				{
					examinationRefNo: 'APP-004a'
				}
			);
		});
	});

	it('returns the original body for other metadata fields', () => {
		const body = {
			author: 'Test author'
		};

		expect(mapMetadataFormToApi('author', body)).toBe(body);
	});
});
