import { endsWith } from '../ends-with.js';

describe('endsWith', () => {
	test('should return true when sourceString ends with searchString', () => {
		expect(endsWith('hello world', 'world')).toBe(true);
	});

	test('should return false when sourceString does not end with searchString', () => {
		expect(endsWith('hello world', 'hello')).toBe(false);
	});
});
