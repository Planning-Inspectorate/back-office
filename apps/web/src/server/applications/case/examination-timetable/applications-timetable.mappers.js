/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetableCreateBody} ApplicationsTimetableCreateBody */
/** @typedef {import('./applications-timetable.types.js').ApplicationsTimetable} ApplicationsTimetable */
/** @typedef {import('./applications-timetable.types.js').ApplicationExaminationTimetableItem} ApplicationExaminationTimetableItem */

/**
 * Converts DB exam record to an obj suitable for edit display
 * @param {ApplicationExaminationTimetableItem} examTimetable
 * @param {number} examTimeTableTypeId
 * @param {string} examTimeTableTypeName
 * @returns {ApplicationsTimetableCreateBody}
 */
export const mapExaminationTimetableToFormBody = (
	examTimetable,
	examTimeTableTypeId,
	examTimeTableTypeName
) => {
	const mainDate = dateSplitTimestampIntoComponents(examTimetable.date);
	const startDate = dateSplitTimestampIntoComponents(examTimetable.startDate);
	const startTime = timeSplitTimeIntoComponents(examTimetable.startTime);
	const endTime = timeSplitTimeIntoComponents(examTimetable.endTime);

	// note: some template types have a 'date' and some have 'end date' - one or the other
	// these are stored in db in 'date' field. So for simplicity, copy db date to both 'date' and 'end date'
	let /** @type ApplicationsTimetableCreateBody */ editFormBody = {
			templateType: examTimeTableTypeName,
			itemTypeName: examTimetable.name,
			name: examTimetable.name,
			timetableId: `${examTimetable.id}`,
			description: convertExamDescriptionToInputText(examTimetable.description),
			timetableTypeId: `${examTimeTableTypeId}`,
			'date.day': mainDate.day,
			'date.month': mainDate.month,
			'date.year': mainDate.year,
			'endDate.day': mainDate.day,
			'endDate.month': mainDate.month,
			'endDate.year': mainDate.year,
			'startDate.day': startDate.day,
			'startDate.month': startDate.month,
			'startDate.year': startDate.year,
			'startTime.hours': startTime.hours,
			'startTime.minutes': startTime.minutes,
			'endTime.hours': endTime.hours,
			'endTime.minutes': endTime.minutes
		};

	return editFormBody;
};

/**
 * splits a unix timestamp string into component date parts
 *
 * @param {string | Date |null} dateTimeField
 * @returns { {day: string, month: string, year: string} }
 */
const dateSplitTimestampIntoComponents = (dateTimeField) => {
	let dateComponents = {};

	if (dateTimeField && typeof dateTimeField === 'string') {
		const mainParts = dateTimeField.split('T');
		const dateParts = mainParts[0].split('-');
		dateComponents.day = dateParts[2];
		dateComponents.month = dateParts[1];
		dateComponents.year = dateParts[0];
	}
	return dateComponents;
};

/**
 * splits a time string eg '10:30' into its 2 component parts
 * @param {string |null} timeString
 * @returns { {hours: string, minutes: string} }
 */
const timeSplitTimeIntoComponents = (timeString) => {
	let timeComponents = {};

	if (timeString) {
		const timeParts = timeString.split(':');
		timeComponents.hours = timeParts[0];
		timeComponents.minutes = timeParts[1];
	}
	return timeComponents;
};

/**
 * converts the string containing the JSON formatted description into text suitable for HTML display in an input text area
 *
 * @param {string|undefined} description
 * @returns {string}
 */
export const convertExamDescriptionToInputText = (description) => {
	let descriptionText;
	if (description) {
		const descriptionObj = JSON.parse(description);

		descriptionText = descriptionObj.preText;
		if (descriptionObj.bulletPoints) {
			for (const eachItem of descriptionObj.bulletPoints) {
				descriptionText += `*${eachItem}`;
			}
		}
	}
	return descriptionText;
};

/**
 * Params are expected to be in the format '01/02/2025, 13:00:00'
 * This can be achieved using the .toLocaleString() function of the date class
 * Reasoning behind dateOrEndDateField name and purpose can be found here
 * https://pins-ds.atlassian.net/wiki/spaces/AS2/pages/1775894531/Changes+to+the+ExaminationTimetableItem+table
 *
 * @param {string} dateOrEndDateField
 * @param {string | null} startDateField
 */
export const mapLocalTimeToDisplayFields = (dateOrEndDateField, startDateField) => {
	const [dateOrEndDate, endTime] = [dateOrEndDateField?.split(', ')].flat();
	const [startDate, startTime] = [startDateField?.split(', ')].flat();
	const formattedStartTime = startTime?.slice(0, 5);
	const formattedEndTime = isEndTimeSpecified(endTime) ? endTime?.slice(0, 5) : null;

	return {
		formattedDate: dateOrEndDate,
		formattedEndDate: dateOrEndDate,
		formattedEndTime,
		formattedStartDate: startDate,
		formattedStartTime
	};
};
/**
 *
 * @param {string | undefined} timeString
 * @returns
 */
const isEndTimeSpecified = (timeString) => timeString !== '00:00:00';

/**
 *
 * @param  {...Date | string | null} dateTimes
 */
export const convertDatetimeToLocalTime = (...dateTimes) => {
	return dateTimes.map((dateTime) => {
		if (!dateTime) return null;
		const localDateTime = new Date(dateTime);
		return localDateTime.toLocaleString();
	});
};
