import daysBetweenDates from '../days-between-dates.js';

describe('days between dates', () => {
	test('returns 1 between date at end of day and next day at start of day', () => {
		const days = daysBetweenDates(new Date(2022, 3, 6, 22), new Date(2022, 3, 7, 2));

		expect(days).toEqual(1);
	});

	test('returns 0 when two dates on the same day', () => {
		const days = daysBetweenDates(new Date(2022, 3, 5, 3), new Date(2022, 3, 5, 20));

		expect(days).toEqual(0);
	});
});
