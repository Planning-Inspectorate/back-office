import { ensureTrailingSlash } from '../util.js';

describe('util', () => {
	describe('ensureTrailingSlash', () => {
		const tests = [
			{ input: '', expected: '/' },
			{ input: 'my-string', expected: 'my-string/' },
			{ input: 'with-slash/', expected: 'with-slash/' },
			{ input: undefined, expected: undefined }
		];

		it.each(tests)(`should handle $input`, ({ input, expected }) => {
			const got = ensureTrailingSlash(input);
			expect(got).toEqual(expected);
		});
	});
});
