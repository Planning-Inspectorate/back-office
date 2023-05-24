import { ERROR_INVALID_SORT_BY, ERROR_INVALID_SORT_BY_OPTION } from '../errors';
import { validateSortByValue } from '../validate-sort-by';

describe('validate-sort-by', () => {
	describe('validateSortByValue', () => {
		const tests = [
			{ name: 'no options', sortBy: '-invalid', options: [], error: ERROR_INVALID_SORT_BY_OPTION },
			{
				name: 'requires leading +/-',
				sortBy: 'my-field',
				options: [],
				error: ERROR_INVALID_SORT_BY
			},
			{
				name: 'must be in options',
				sortBy: '+my-field',
				options: ['field-1', 'another-field'],
				error: ERROR_INVALID_SORT_BY_OPTION
			},
			{
				name: 'valid option',
				sortBy: '+my-field',
				options: ['my-field', 'another-field'],
				want: true
			}
		];

		for (const { name, sortBy, options, want, error } of tests) {
			it('' + name, () => {
				if (error) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(() => validateSortByValue(options, sortBy)).toThrow(error);
				} else {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(validateSortByValue(options, sortBy)).toEqual(want);
				}
			});
		}
	});
});
