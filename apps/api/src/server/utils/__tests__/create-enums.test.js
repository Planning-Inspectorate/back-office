import Enum from '../create-enums.js';

describe('Enum', () => {
	it('should create an enum with the correct values', () => {
		const DaysOfWeek = new Enum([
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday'
		]);

		expect(DaysOfWeek.has('Monday')).toBe(true);
		expect(DaysOfWeek.get('Tuesday')).toBe('Tuesday');
		expect(DaysOfWeek.get('Foo')).toBeUndefined();
	});
});
