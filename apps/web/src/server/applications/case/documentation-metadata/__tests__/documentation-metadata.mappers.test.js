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

	it('returns the original body for other metadata fields', () => {
		const body = {
			author: 'Test author'
		};

		expect(mapMetadataFormToApi('author', body)).toBe(body);
	});
});
