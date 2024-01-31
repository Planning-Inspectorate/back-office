import { buildQueryString } from '../build-query-string.js';

describe('#buildQueryString', () => {
	test('should return a query string with no undefined values', () => {
		const query = {
			param1: 'value1',
			param2: undefined,
			param3: 'value3'
		};
		const expectedQueryString = 'param1=value1&param2=&param3=value3';
		expect(buildQueryString(query)).toEqual(expectedQueryString);
	});

	test('should stringify arrays as expected', () => {
		const query = {
			param1: 'value1',
			param2: ['value2-1', 'value2-2', 'value2-3'],
			param3: 'value3'
		};
		const expectedQueryString =
			'param1=value1&param2=value2-1&param2=value2-2&param2=value2-3&param3=value3';
		expect(buildQueryString(query)).toEqual(expectedQueryString);
	});
});
