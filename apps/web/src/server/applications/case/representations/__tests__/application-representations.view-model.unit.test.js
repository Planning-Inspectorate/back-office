import { representationsFixture } from '../__fixtures__/representations.fixture.js';
import { getRepresentationsViewModel } from '../application-representations.view-model.js';

describe('application representations view-model', () => {
	describe('#representationsVieModel', () => {
		it('should return representations mapped to the view model', () => {
			const response = getRepresentationsViewModel(representationsFixture);

			expect(response).toEqual([
				{
					received: '01 Jan 2022',
					redacted: 'Redacted',
					reference: 'mock reference',
					status: {
						class: 'govuk-tag--grey',
						text: 'AWAITING REVIEW'
					},
					title: 'org name 1',
					id: '1'
				},
				{
					received: '01 Jan 2022',
					redacted: 'Unredacted',
					reference: 'mock reference',
					status: {
						class: 'govuk-tag',
						text: 'VALID'
					},
					title: 'first lastName',
					id: '2'
				}
			]);
		});
	});
});
