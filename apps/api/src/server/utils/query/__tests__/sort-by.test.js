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
				name: 'not a string',
				queryStr: [1, 2, 3],
				want: undefined
			},
			{
				name: 'empty string',
				queryStr: '',
				want: undefined
			},
			{
				name: 'no explicit +/-',
				queryStr: 'myField',
				want: [{ myField: 'asc' }]
			},
			{
				name: 'explicit +',
				queryStr: '+myField',
				want: [{ myField: 'asc' }]
			},
			{
				name: 'explicit -',
				queryStr: '-myField',
				want: [{ myField: 'desc' }]
			},
			{
				name: 'no explicit +/- and explicit - and expicit +',
				queryStr: 'myField1+myField2-myField3',
				want: [{ myField1: 'asc' }, { myField2: 'asc' }, { myField3: 'desc' }]
			},
			{
				name: 'explicit + and explicit -',
				queryStr: '+myField1-myField2-myField3',
				want: [{ myField1: 'asc' }, { myField2: 'desc' }, { myField3: 'desc' }]
			}
		];

		for (const { name, queryStr, want } of tests) {
			it('' + name, () => {
				expect(sortByFromQuery(queryStr)).toEqual(want);
			});
		}
	});
});
