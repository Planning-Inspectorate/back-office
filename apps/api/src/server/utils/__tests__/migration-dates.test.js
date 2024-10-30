import {
	changeEndTime,
	handleDateTimeToUTC,
	mapDateTimesToCorrectFields
} from '#utils/migration-dates.js';
import { examTimetableItemTypes } from '@pins/examination-timetable-utils';

describe('migration-dates', () => {
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

	describe('mapDateTimesToCorrectFields', () => {
		describe('if type is not in eventItemsToRemap', () => {
			test('should return startDateTime and endDateTime without changes', () => {
				const startDateTime = new Date('2022-10-31T00:00:00');
				const endDateTime = new Date('2022-10-31T12:30:00');
				const type = 'type';
				const result = mapDateTimesToCorrectFields(startDateTime, endDateTime, type);
				expect(result.startDateTimeField).toEqual(startDateTime);
				expect(result.endDateTimeField).toEqual(endDateTime);
			});
		});

		describe('if type is in eventItemsToRemap', () => {
			describe('and startDateTime is null', () => {
				test('should return startDateTime and endDateTime with changes', () => {
					const startDateTime = null;
					const endDateTime = new Date('2022-10-31T12:30:00');
					const type = examTimetableItemTypes.PRELIMINARY_MEETING;
					const result = mapDateTimesToCorrectFields(startDateTime, endDateTime, type);
					// startDateField should be the value of input endDateTime
					expect(result.startDateTimeField).toEqual('2022-10-31T12:30:00.000Z');
					// endDateTimeField should be the value of input endDateTime with time set to 00:00:00
					expect(result.endDateTimeField).toEqual('2022-10-31T00:00:00.000Z');
				});
			});
		});

		describe('and startDateTime has no time', () => {
			test('should return startDateTime and endDateTime with changes', () => {
				const startDateTime = new Date('2022-10-31T00:00:00');
				const endDateTime = new Date('2022-10-31T12:30:00');
				const type = examTimetableItemTypes.PRELIMINARY_MEETING;
				const result = mapDateTimesToCorrectFields(startDateTime, endDateTime, type);
				// startDateField should be the value of input endDateTime
				expect(result.startDateTimeField).toEqual('2022-10-31T12:30:00.000Z');
				// endDateTimeField should be the value of input endDateTime with time set to 00:00:00
				expect(result.endDateTimeField).toEqual('2022-10-31T00:00:00.000Z');
			});
		});

		describe('and startDateTime is not null', () => {
			test('should return startDateTime and endDateTime without changes', () => {
				const startDateTime = new Date('2022-10-31T12:30:00');
				const endDateTime = new Date('2022-10-31T12:30:00');
				const type = examTimetableItemTypes.PRELIMINARY_MEETING;
				const result = mapDateTimesToCorrectFields(startDateTime, endDateTime, type);
				expect(result.startDateTimeField).toEqual(startDateTime);
				expect(result.endDateTimeField).toEqual(endDateTime);
			});
		});
	});
});
