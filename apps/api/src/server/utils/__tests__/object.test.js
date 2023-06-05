import { hasAllProperties } from '../object';

describe('object', () => {
	describe('hasAllProperties', () => {
		const tests = [
			{ name: 'handle null', obj: null, props: [], want: false },
			{ name: 'handle string', obj: 'hello', props: [], want: false },
			{ name: 'handle number', obj: 123, props: [], want: false },
			{ name: 'handle undefined', obj: undefined, props: [], want: false },
			{ name: 'has property', obj: { myProp: 'hello' }, props: ['myProp'], want: true },
			{ name: 'no property', obj: { myProp: 'hello' }, props: ['myProp2'], want: false },
			{
				name: 'has all properties',
				obj: { myProp: 'hello', prop2: 'world', data: { here: 'is more' } },
				props: ['myProp', 'prop2', 'data'],
				want: true
			},
			{
				name: 'missing one',
				obj: { myProp: 'hello', prop2: 'world' },
				props: ['myProp', 'prop2', 'data'],
				want: false
			}
		];
		for (const { name, obj, props, want } of tests) {
			test('' + name, () => {
				const got = hasAllProperties(obj, ...props);
				expect(got).toEqual(want);
			});
		}
	});
});
