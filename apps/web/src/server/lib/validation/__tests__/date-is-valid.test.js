import dateIsValid from "../date-is-valid.js";

describe('date-is-valid', () => {
	it('should return true if day, month and year params form a date that is semantically valid and real', () => {
		expect(dateIsValid('29', '02', '2024')).toBe(true);
	});
	it('should return false if day, month and year params form a date that is semantically valid but not real', () => {
		expect(dateIsValid('29', '02', '2023')).toBe(false);
	});
	it('should return true if day, month and year params form a valid real date, and day and month params have leading zeroes', () => {
		expect(dateIsValid('01', '02', '2023')).toBe(true);
	});
	it('should return true if day, month and year params form a valid real date, and day and month params do not have leading zeroes', () => {
		expect(dateIsValid('1', '2', '2023')).toBe(true);
	});
	it('should return false if day parameter has an incorrect number of digits', () => {
		expect(dateIsValid('', '01', '2023')).toBe(false);
		expect(dateIsValid('100', '01', '2023')).toBe(false);
	});
	it('should return false if month parameter has an incorrect number of digits', () => {
		expect(dateIsValid('01', '', '2023')).toBe(false);
		expect(dateIsValid('01', '100', '2023')).toBe(false);
	});
	it('should return false if year parameter has an incorrect number of digits', () => {
		expect(dateIsValid('01', '01', '20')).toBe(false);
		expect(dateIsValid('01', '01', '202')).toBe(false);
		expect(dateIsValid('01', '01', '20230')).toBe(false);
	});
	it('should return false if day parameter is not parseable to an integer', () => {
		expect(dateIsValid('first', '01', '2023')).toBe(false);
	});
	it('should return false if month parameter is not parseable to an integer', () => {
		expect(dateIsValid('01', 'may', '2023')).toBe(false);
	});
	it('should return false if year parameter is not parseable to an integer', () => {
		expect(dateIsValid('01', '01', 'year')).toBe(false);
	});
	it('should return false if day parameter is outside the valid range', () => {
		expect(dateIsValid('0', '01', '2023')).toBe(false);
		expect(dateIsValid('32', '01', '2023')).toBe(false);
	});
	it('should return false if month parameter is outside the valid range', () => {
		expect(dateIsValid('01', '0', '2023')).toBe(false);
		expect(dateIsValid('01', '13', '2023')).toBe(false);
	});
});
