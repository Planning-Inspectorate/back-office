import { getFilterViewModel } from '../utils/filter/filter-view-model.js';

describe('#getFilterViewModel', () => {
	it('should get the default filter view model', () => {
		const response = getFilterViewModel();
		expect(response).toEqual([
			{
				checked: false,
				text: 'Awaiting review (0)',
				value: 'AWAITING_REVIEW'
			},
			{
				checked: false,
				text: 'Valid (0)',
				value: 'VALID'
			},
			{
				checked: false,
				text: 'Draft (0)',
				value: 'DRAFT'
			},
			{
				checked: false,
				text: 'Published (0)',
				value: 'PUBLISHED'
			},
			{
				checked: false,
				text: 'Referred (0)',
				value: 'REFERRED'
			},
			{
				checked: false,
				text: 'Withdrawn (0)',
				value: 'WITHDRAWN'
			},
			{
				checked: false,
				text: 'Invalid (0)',
				value: 'INVALID'
			},
			{
				checked: false,
				text: 'Archived (0)',
				value: 'ARCHIVED'
			},
			{
				checked: false,
				text: 'Under 18 (0)',
				value: 'UNDER_18'
			}
		]);
	});
	it('should get the filter view model for a singe filter and mark it as checked', () => {
		const response = getFilterViewModel('AWAITING_REVIEW');
		expect(response).toEqual([
			{
				checked: true,
				text: 'Awaiting review (0)',
				value: 'AWAITING_REVIEW'
			},
			{
				checked: false,
				text: 'Valid (0)',
				value: 'VALID'
			},
			{
				checked: false,
				text: 'Draft (0)',
				value: 'DRAFT'
			},
			{
				checked: false,
				text: 'Published (0)',
				value: 'PUBLISHED'
			},
			{
				checked: false,
				text: 'Referred (0)',
				value: 'REFERRED'
			},
			{
				checked: false,
				text: 'Withdrawn (0)',
				value: 'WITHDRAWN'
			},
			{
				checked: false,
				text: 'Invalid (0)',
				value: 'INVALID'
			},
			{
				checked: false,
				text: 'Archived (0)',
				value: 'ARCHIVED'
			},
			{
				checked: false,
				text: 'Under 18 (0)',
				value: 'UNDER_18'
			}
		]);
	});
	it('should get the filter view model for a multiple filters and mark it as checked', () => {
		const response = getFilterViewModel(['AWAITING_REVIEW', 'VALID']);
		expect(response).toEqual([
			{
				checked: true,
				text: 'Awaiting review (0)',
				value: 'AWAITING_REVIEW'
			},
			{
				checked: true,
				text: 'Valid (0)',
				value: 'VALID'
			},
			{
				checked: false,
				text: 'Draft (0)',
				value: 'DRAFT'
			},
			{
				checked: false,
				text: 'Published (0)',
				value: 'PUBLISHED'
			},
			{
				checked: false,
				text: 'Referred (0)',
				value: 'REFERRED'
			},
			{
				checked: false,
				text: 'Withdrawn (0)',
				value: 'WITHDRAWN'
			},
			{
				checked: false,
				text: 'Invalid (0)',
				value: 'INVALID'
			},
			{
				checked: false,
				text: 'Archived (0)',
				value: 'ARCHIVED'
			},
			{
				checked: false,
				text: 'Under 18 (0)',
				value: 'UNDER_18'
			}
		]);
	});
	it('should get the filter view model for a values', () => {
		const response = getFilterViewModel(
			['AWAITING_REVIEW', 'VALID'],
			[
				{ count: 1, name: 'UNDER_18' },
				{ count: 2, name: 'VALID' },
				{ count: 1, name: 'PUBLISHED' }
			]
		);
		expect(response).toEqual([
			{
				checked: true,
				text: 'Awaiting review (0)',
				value: 'AWAITING_REVIEW'
			},
			{
				checked: true,
				text: 'Valid (2)',
				value: 'VALID'
			},
			{
				checked: false,
				text: 'Draft (0)',
				value: 'DRAFT'
			},
			{
				checked: false,
				text: 'Published (1)',
				value: 'PUBLISHED'
			},
			{
				checked: false,
				text: 'Referred (0)',
				value: 'REFERRED'
			},
			{
				checked: false,
				text: 'Withdrawn (0)',
				value: 'WITHDRAWN'
			},
			{
				checked: false,
				text: 'Invalid (0)',
				value: 'INVALID'
			},
			{
				checked: false,
				text: 'Archived (0)',
				value: 'ARCHIVED'
			},
			{
				checked: false,
				text: 'Under 18 (1)',
				value: 'UNDER_18'
			}
		]);
	});
});
