import { dateIsAfterDate, dateIsPastOrToday } from '#utils/date-comparison.js';

describe('date is after date', () => {
	test('returns false if date is before afterDate', () => {
		expect(dateIsAfterDate(new Date('January 1, 2023'), new Date('January 2, 2023'))).toBe(false);
	});

	test('returns false if date is same as afterDate', () => {
		expect(dateIsAfterDate(new Date('January 1, 2023'), new Date('January 1, 2023'))).toBe(false);
	});

	test('returns true if date is after afterDate', () => {
		expect(dateIsAfterDate(new Date('January 2, 2023'), new Date('January 1, 2023'))).toBe(true);
	});
});

describe('date is in past or today', () => {
	test('returns false if date is before afterDate', () => {
		expect(dateIsPastOrToday(new Date('January 1, 2023'), new Date('January 2, 2023'))).toBe(true);
	});

	test('returns true if date is same as afterDate', () => {
		expect(dateIsPastOrToday(new Date('January 1, 2023'), new Date('January 1, 2023'))).toBe(true);
	});

	test('returns false if date is after afterDate', () => {
		expect(dateIsPastOrToday(new Date('January 2, 2023'), new Date('January 1, 2023'))).toBe(false);
	});
});
