import { zonedTimeToUtc } from 'date-fns-tz';
import { examTimetableItemTypes } from '@pins/examination-timetable-utils';

/**
 * if default time comes as 00:00 and the type is a deadline,
 * we convert to 23:59 to match existing behaviour
 * @param {Date} date
 * @returns {Date}
 */
export const changeEndTime = (date) => {
	if (date.getHours() === 0 && date.getMinutes() === 0) {
		date.setHours(23, 59);
	}
	return date;
};

/**
 * Converts a date time in UTC which can be an end datetime (e.g. 23:59)
 * and can be returned as a single datetime or separated into date and time
 * @param {string | null | undefined} datetimeString
 * @param {{isEndDate: boolean}} options
 * @returns {Date | null}
 */
export const handleDateTimeToUTC = (datetimeString, { isEndDate = false }) => {
	if (!datetimeString || isNaN(new Date(datetimeString).getTime())) {
		return null;
	}

	const datetime = new Date(datetimeString);
	const datetimeWithTime = isEndDate ? changeEndTime(datetime) : datetime;
	return zonedTimeToUtc(datetimeWithTime, 'Europe/London');
};

/**
 * Map dates to correct fields
 * @param {string} startDateTime
 * @param {string} endDateTime
 * @param {string} type
 * @returns {{startDateTimeField: string | null, endDateTimeField: string | null}}
 */
export const mapDateTimesToCorrectFields = (startDateTime, endDateTime, type) => {
	const eventItemsToRemap = [
		examTimetableItemTypes.PRELIMINARY_MEETING,
		examTimetableItemTypes.OPEN_FLOOR_HEARING,
		examTimetableItemTypes.ISSUE_SPECIFIC_HEARING,
		examTimetableItemTypes.ACCOMPANIED_SITE_INSPECTION,
		examTimetableItemTypes.COMPULSORY_ACQUISITION_HEARING,
		examTimetableItemTypes.OTHER_MEETING
	];
	// we only transform if the type is in the list and we do not have a start time
	const shouldRemap =
		eventItemsToRemap.includes(type) &&
		(!startDateTime || new Date(startDateTime).getHours() === 0);
	if (shouldRemap) {
		const startDateTimeField = new Date(endDateTime);
		const endDateTimeField = new Date(endDateTime);
		if (isNaN(endDateTimeField.getTime())) {
			throw new Error(`Invalid end date ${endDateTime}`);
		}
		endDateTimeField.setHours(0, 0, 0, 0);
		return {
			startDateTimeField: startDateTimeField.toISOString(),
			endDateTimeField: endDateTimeField.toISOString()
		};
	} else {
		return {
			startDateTimeField: startDateTime ? new Date(startDateTime) : null,
			endDateTimeField: endDateTime ? new Date(endDateTime) : null
		};
	}
};
