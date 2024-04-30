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

	test('should encode values as expected', () => {
		const query = {
			sortBy: '+value1,-value2,value3'
		};
		const expectedQueryString = 'sortBy=%2Bvalue1&sortBy=-value2&sortBy=value3';
		expect(buildQueryString(query)).toEqual(expectedQueryString);
	});
});
