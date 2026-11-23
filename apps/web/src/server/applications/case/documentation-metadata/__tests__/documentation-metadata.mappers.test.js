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
				examinationLibraryCategoryChildAPP: '7'
			};

			expect(mapMetadataFormToApi('examination-library-category', body)).toEqual({
				examinationLibraryCategoryId: 7
			});
		});

		it.each([
			['EVX', 'examinationLibraryCategoryChildEVX', '2327'],
			['PDX', 'examinationLibraryCategoryChildPDX', '2332'],
			['REPX', 'examinationLibraryCategoryChildREPX', '2330']
		])('maps the selected %s child to the examination library category id', (group, field, id) => {
			const body = {
				examinationLibraryCategoryId: group,
				[field]: id
			};
			expect(mapMetadataFormToApi('examination-library-category', body)).toEqual({
				examinationLibraryCategoryId: Number(id)
			});
		});
		it('only maps the child belonging to the selected category group', () => {
			const body = {
				examinationLibraryCategoryId: 'EVX',
				examinationLibraryCategoryChildAPP: '7',
				examinationLibraryCategoryChildEVX: '2327',
				examinationLibraryCategoryChildPDX: '2332',
				examinationLibraryCategoryChildREPX: '2330'
			};
			expect(mapMetadataFormToApi('examination-library-category', body)).toEqual({
				examinationLibraryCategoryId: 2327
			});
		});
		it('ignores dropdown values when a standard category is selected', () => {
			const body = {
				examinationLibraryCategoryId: '10',
				examinationLibraryCategoryChildAPP: '7',
				examinationLibraryCategoryChildEVX: '2327',
				examinationLibraryCategoryChildPDX: '2332',
				examinationLibraryCategoryChildREPX: '2330'
			};
			expect(mapMetadataFormToApi('examination-library-category', body)).toEqual({
				examinationLibraryCategoryId: 10
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
