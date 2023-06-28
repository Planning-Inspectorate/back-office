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
 * @param {string} description
 * @returns
 */
const convertExamDescriptionToInputText = (description) => {
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
