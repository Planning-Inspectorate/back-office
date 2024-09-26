import { mapLocalTimeToDisplayFields } from '../applications-timetable.mappers.js';

const testDate = '01/02/2025';
const testStartTime = '12:00:00';
const testEndTime = '18:00:00';
const testNoTimeSpecified = '00:00:00';
const testFormattedStartTime = '12:00';
const testFormattedEndTime = '18:00';

describe('mapLocalTimeToDisplayFields', () => {
	test('when both params are passed in', () => {
		const testDateOrEndDateField = `${testDate}, ${testEndTime}`;
		const testStartDateField = `${testDate}, ${testStartTime}`;

		const result = mapLocalTimeToDisplayFields(testDateOrEndDateField, testStartDateField);

		expect(result).toEqual({
			formattedDate: testDate,
			formattedEndDate: testDate,
			formattedEndTime: testFormattedEndTime,
			formattedStartDate: testDate,
			formattedStartTime: testFormattedStartTime
		});
	});

	test('when only dateOrEndDateField is passed in', () => {
		const testDateOrEndDateField = `${testDate}, ${testEndTime}`;

		const result = mapLocalTimeToDisplayFields(testDateOrEndDateField, null);

		expect(result).toEqual({
			formattedDate: testDate,
			formattedEndDate: testDate,
			formattedEndTime: testFormattedEndTime,
			formattedStartDate: undefined,
			formattedStartTime: undefined
		});
	});

	test('when dateOrEndDateField is passed in with no time specified', () => {
		const testDateOrEndDateField = `${testDate}, ${testNoTimeSpecified}`;

		const result = mapLocalTimeToDisplayFields(testDateOrEndDateField, null);

		expect(result).toEqual({
			formattedDate: testDate,
			formattedEndDate: testDate,
			formattedEndTime: null,
			formattedStartDate: undefined,
			formattedStartTime: undefined
		});
	});
});
