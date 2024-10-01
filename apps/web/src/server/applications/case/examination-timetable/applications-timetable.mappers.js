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
	const { formattedEndTime, formattedStartTime } = mapUtcTimeToLocal24hTimeString(
		examTimetable.date,
		examTimetable.startDate
	);
	const [startHours, startMinutes] = [formattedStartTime?.split(':')].flat();
	const [endHours, endMinutes] = [formattedEndTime?.split(':')].flat();

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
			'startTime.hours': startHours,
			'startTime.minutes': startMinutes,
			'endTime.hours': endHours,
			'endTime.minutes': endMinutes
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
 * Reasoning behind dateOrEndDateField name and purpose can be found here
 * https://pins-ds.atlassian.net/wiki/spaces/AS2/pages/1775894531/Changes+to+the+ExaminationTimetableItem+table
 *
 * @param {Date | string} dateOrEndDateField
 * @param {Date | string | null} startDateField
 */
export const mapUtcTimeToLocal24hTimeString = (dateOrEndDateField, startDateField) => {
	const formattedEndTime = new Date(dateOrEndDateField).toISOString().includes('00:00:00')
		? null
		: formatUtcDateTimeToLocal24h(dateOrEndDateField);
	const formattedStartTime = startDateField && formatUtcDateTimeToLocal24h(startDateField);

	return {
		formattedEndTime,
		formattedStartTime
	};
};

/**
 *
 * @param {Date | string} utcDateString
 * @returns
 */
const formatUtcDateTimeToLocal24h = (utcDateString) => {
	const localTimeString = new Date(utcDateString).toLocaleTimeString('en-GB', {
		timeZone: 'Europe/London'
	});
	return localTimeString.substring(0, 5);
};
