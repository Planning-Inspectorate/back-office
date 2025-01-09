import { collapse } from '../collapse.js';

describe('collapse', () => {
	test('should concatenate object values with default delimiter', () => {
		const input = { a: 'Hello', b: 'World', c: '!' };
		const expectedOutput = 'Hello<br>World<br>!';
		expect(collapse(input)).toBe(expectedOutput);
	});

	test('should concatenate object values with custom delimiter', () => {
		const input = { a: 'Hello', b: 'World', c: '!' };
		const delimiter = ', ';
		const expectedOutput = 'Hello, World, !';
		expect(collapse(input, delimiter)).toBe(expectedOutput);
	});

	test('should ignore falsy values in the object', () => {
		const input = { a: 'Hello', b: '', c: null, d: 'World', e: undefined, f: '!' };
		const expectedOutput = 'Hello<br>World<br>!';
		expect(collapse(input)).toBe(expectedOutput);
	});
});
