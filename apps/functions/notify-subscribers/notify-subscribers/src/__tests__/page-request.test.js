import { PagedRequest } from '../paged-request.js';

describe('paged-request', () => {
	const numbers = Array.from(Array(102).keys()).sort();

	/**
	 * @param {T[]} items
	 * @returns {import('../types.js').Request<T>}
	 * @template T
	 */
	function request(items) {
		return async (page, pageSize) => {
			const start = (page - 1) * pageSize;
			const end = start + pageSize;
			const pageCount = Math.ceil(items.length / pageSize);
			return {
				page,
				pageSize,
				pageCount,
				itemCount: items.length,
				items: items.slice(start, end)
			};
		};
	}

	const tests = [
		{
			name: 'empty',
			pageSize: 25,
			request: request([]),
			want: []
		},
		{
			name: 'numbers',
			pageSize: 25,
			request: request(numbers),
			want: numbers
		},
		{
			name: 'single page',
			pageSize: 200,
			request: request(numbers),
			want: numbers
		}
	];
	it.each(tests)('$name', async ({ pageSize, request, want }) => {
		const req = new PagedRequest(pageSize, request);
		const responses = [];
		for await (const res of req) {
			responses.push(...res.items);
		}

		expect(responses).toEqual(want);
	});
});
