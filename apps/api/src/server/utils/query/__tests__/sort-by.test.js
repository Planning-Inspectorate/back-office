import { sortByFromQuery } from '../sort-by';

describe('sort-by', () => {
	describe('sortByFromQuery', () => {
		const tests = [
			{
				name: 'undefined',
				queryStr: undefined,
				want: undefined
			},
			{
				name: 'no explicit +/-',
				queryStr: 'myField',
				want: { myField: 'asc' }
			},
			{
				name: 'explicit +',
				queryStr: '+myField',
				want: { myField: 'asc' }
			},
			{
				name: 'explicit -',
				queryStr: '-myField',
				want: { myField: 'desc' }
			}
		];

		for (const { name, queryStr, want } of tests) {
			it('' + name, () => {
				expect(sortByFromQuery(queryStr)).toEqual(want);
			});
		}
	});
});
