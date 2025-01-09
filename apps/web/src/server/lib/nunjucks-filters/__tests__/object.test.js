import { hasOneOf } from '../object';

describe('hasOneOf', () => {
	test('returns true when object contains at least one of the provided keys', () => {
		const object = { a: 1, b: 2, c: 3 };
		const keys = ['b', 'd'];
		expect(hasOneOf(object, keys)).toBe(true);
	});

	test('returns false when object does not contain any of the provided keys', () => {
		const object = { a: 1, b: 2, c: 3 };
		const keys = ['d', 'e'];
		expect(hasOneOf(object, keys)).toBe(false);
	});
});
