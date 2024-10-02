import { changeEndTime, handleDateTimeToUTC } from '#utils/migration-dates.js';

describe('odw-date', () => {
	describe('changeEndTime', () => {
		describe('if time is 00:00', () => {
			test('should change time to 23:59', () => {
				const date = new Date('2022-10-05T00:00:00');
				changeEndTime(date);
				expect(date.getHours()).toBe(23);
				expect(date.getMinutes()).toBe(59);
			});
		});
		describe('if time is not 00:00', () => {
			test('should not change time', () => {
				const date = new Date('2022-10-05T12:30:00');
				changeEndTime(date);
				expect(date.getHours()).toBe(12);
				expect(date.getMinutes()).toBe(30);
			});
		});
	});

	describe('handleDateTimeToUTC', () => {
		describe('Invalid Inputs', () => {
			test('should return null for an empty datetimeString', () => {
				const result = handleDateTimeToUTC('', { isEndDate: false });
				expect(result).toBeNull();
			});

			test('should return null for an invalid datetimeString', () => {
				const result = handleDateTimeToUTC('invalid date', { isEndDate: false });
				expect(result).toBeNull();
			});

			describe('when isEndDate is true', () => {
				test('should return null for date and time', () => {
					const result = handleDateTimeToUTC('', { isEndDate: true });
					expect(result).toBeNull();
				});
			});

			describe('when isEndDate is false', () => {
				test('should return null for date and time', () => {
					const result = handleDateTimeToUTC('', { isEndDate: false });
					expect(result).toBeNull();
				});
			});
		});

		describe('Valid Inputs with varying isEndDate values', () => {
			test.each([
				['2024-09-10T15:30:00', false, '2024-09-10T14:30:00.000Z'],
				['2024-09-10T15:30:00', true, '2024-09-10T14:30:00.000Z'],
				['2024-09-10T00:00:00', false, '2024-09-09T23:00:00.000Z'],
				['2024-09-10T00:00:00', true, '2024-09-10T22:59:00.000Z']
			])(
				'should convert %s to UTC and and return correctly given if its an end date (%s)',
				(datetimeString, isEndDate, expectedDate) => {
					const result = handleDateTimeToUTC(datetimeString, { isEndDate });
					expect(result instanceof Date).toBe(true);
					expect(result).not.toBeNull();
					expect(result?.toISOString()).toBe(expectedDate);
				}
			);
		});
	});
});
