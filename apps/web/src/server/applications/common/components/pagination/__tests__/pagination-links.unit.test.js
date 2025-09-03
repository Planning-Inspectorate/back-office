import { getPaginationLinks } from '../pagination-links.js';

describe('#getPaginationLinks', () => {
	describe('next and previous links', () => {
		describe('pagination for page one', () => {
			const response = getPaginationLinks(1, 5, { page: 1 }, 'mock-url');
			const expectedItems = [
				{
					current: true,
					href: 'mock-url?page=1',
					number: 1
				},
				{
					current: false,
					href: 'mock-url?page=2',
					number: 2
				},
				{
					current: false,
					href: 'mock-url?page=3',
					number: 3
				},
				{
					current: false,
					href: 'mock-url?page=4',
					number: 4
				},
				{
					current: false,
					href: 'mock-url?page=5',
					number: 5
				}
			];

			it('should create a next link for the next page (page + 1)', () => {
				expect(response.next).toEqual({
					href: 'mock-url?page=2'
				});
			});
			it('should not create a previous link when the page = 1', () => {
				expect(response.previous).toEqual('');
			});
			it('should contain the pagination object with an empty previous link', () => {
				expect(response.items).toEqual(expectedItems);
			});
		});
		describe('pagination for the last page', () => {
			const response = getPaginationLinks(5, 5, { page: 5 }, 'mock-url');
			const expectedItems = [
				{
					current: false,
					href: 'mock-url?page=1',
					number: 1
				},
				{
					current: false,
					href: 'mock-url?page=2',
					number: 2
				},
				{
					current: false,
					href: 'mock-url?page=3',
					number: 3
				},
				{
					current: false,
					href: 'mock-url?page=4',
					number: 4
				},
				{
					current: true,
					href: 'mock-url?page=5',
					number: 5
				}
			];

			it('should not create a next link when the page === page count', () => {
				expect(response.next).toEqual('');
			});
			it('should create a previous link for the page previous to page provided (page - 1)', () => {
				expect(response.previous).toEqual({ href: 'mock-url?page=4' });
			});
			it('should contain the pagination object with an empty next link', () => {
				expect(response.items).toEqual(expectedItems);
			});
		});
	});

	describe('pagination for an active page with next and previous', () => {
		const response = getPaginationLinks(3, 5, { page: 5 }, 'mock-url');
		const expectedItems = [
			{
				current: false,
				href: 'mock-url?page=1',
				number: 1
			},
			{
				current: false,
				href: 'mock-url?page=2',
				number: 2
			},
			{
				current: true,
				href: 'mock-url?page=3',
				number: 3
			},
			{
				current: false,
				href: 'mock-url?page=4',
				number: 4
			},
			{
				current: false,
				href: 'mock-url?page=5',
				number: 5
			}
		];

		it('should not create a next link when the page === page count', () => {
			expect(response.next).toEqual({ href: 'mock-url?page=4' });
		});
		it('should create a previous link for the page previous to page provided (page - 1)', () => {
			expect(response.previous).toEqual({ href: 'mock-url?page=2' });
		});
		it('should contain the pagination object with an empty next link', () => {
			expect(response.items).toEqual(expectedItems);
		});
	});

	describe('pagination length of items', () => {
		it('should return a maximum of 7 items', () => {
			const response = getPaginationLinks(5, 50, { page: 5 }, 'mock-url');
			expect(response.items.length).toEqual(7);
		});
		it('should return 4 items when on 1st page, ellipse should be 3rd', () => {
			const response = getPaginationLinks(1, 50, { page: 5 }, 'mock-url');
			expect(response.items.length).toEqual(4);
			expect(response.items[2]).toEqual({ ellipsis: true });
		});
		it('should return 4 items when on last page, ellipse should be 3rd', () => {
			const response = getPaginationLinks(50, 50, { page: 5 }, 'mock-url');
			expect(response.items.length).toEqual(4);
			expect(response.items[1]).toEqual({ ellipsis: true });
		});
	});

	describe('pagination query', () => {
		const mockQuery = {
			page: 1,
			mockStringQuery: 'mock-string-query',
			mockNumberQuery: 22
		};

		const response = getPaginationLinks(5, 5, mockQuery, 'mock-url');

		it('should not manipulate the query other than the page', () => {
			expect(response.items[0]).toEqual({
				current: false,
				href: 'mock-url?mockStringQuery=mock-string-query&mockNumberQuery=22&page=1',
				number: 1
			});
		});
	});
});
