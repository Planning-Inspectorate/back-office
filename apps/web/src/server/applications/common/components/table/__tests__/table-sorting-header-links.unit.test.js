import { tableSortingHeaderLinks } from '../table-sorting-header-links.js';

describe('#tableSortingHeaderLinks', () => {
	describe('initial sort link states', () => {
		const mockQuery = {
			page: 5,
			mockStringQuery: 'mock-string-query',
			mockNumberQuery: 22
		};

		const response = tableSortingHeaderLinks(mockQuery, 'Reference', 'reference', 'mock url');

		it('should set the page to 1 - business rule - all sort changes lead back to the first page', () => {
			expect(response.link).toContain('page=1');
		});

		it('should reset the page to 1 and add the sort by param { sortBy: reference }', () => {
			expect(response).toEqual({
				active: false,
				isDescending: false,
				link: 'mock url?page=1&mockStringQuery=mock-string-query&mockNumberQuery=22&sortBy=reference',
				text: 'Reference',
				value: 'reference'
			});
		});
	});

	describe('active sort ( defaults to ascending )', () => {
		const mockQuery = {
			page: 5,
			mockStringQuery: 'mock-string-query',
			mockNumberQuery: 22,
			sortBy: 'reference'
		};

		const response = tableSortingHeaderLinks(mockQuery, 'Reference', 'reference', 'mock url');

		it('should set a matching value of the query param sortBy to active', () => {
			expect(response.active).toEqual(true);
		});

		it('should set the link to include the descending sortBy value (pre fix -)', () => {
			expect(response.link).toContain('sortBy=-reference');
		});

		it('should set the object shape', () => {
			expect(response).toEqual({
				active: true,
				isDescending: false,
				link: 'mock url?page=1&mockStringQuery=mock-string-query&mockNumberQuery=22&sortBy=-reference',
				text: 'Reference',
				value: 'reference'
			});
		});
	});

	describe('descending active sort ( pre fix - to the value for the api )', () => {
		const mockQuery = {
			page: 5,
			mockStringQuery: 'mock-string-query',
			mockNumberQuery: 22,
			sortBy: '-reference'
		};

		const response = tableSortingHeaderLinks(mockQuery, 'Reference', 'reference', 'mock url');

		it('should set a matching value of the query param sortBy to active', () => {
			expect(response.active).toEqual(false);
			expect(response.isDescending).toEqual(true);
		});

		it('should set the link to include the ascending sortBy value', () => {
			expect(response.link).toContain('sortBy=reference');
		});

		it('should set the object shape', () => {
			expect(response).toEqual({
				active: false,
				isDescending: true,
				link: 'mock url?page=1&mockStringQuery=mock-string-query&mockNumberQuery=22&sortBy=reference',
				text: 'Reference',
				value: 'reference'
			});
		});
	});

	describe('no value provided - indicates no link required', () => {
		const mockQuery = {
			page: 5,
			mockStringQuery: 'mock-string-query',
			mockNumberQuery: 22
		};

		const response = tableSortingHeaderLinks(mockQuery, 'Reference', '', 'mock url');

		it('should no set a value or sort by param', () => {
			expect(response).toEqual({
				active: false,
				isDescending: false,
				link: 'mock url?page=1&mockStringQuery=mock-string-query&mockNumberQuery=22&sortBy=',
				text: 'Reference',
				value: ''
			});
		});
	});
});
