import { examTimetableItemTypes } from './constants.js';

/**
 * Mapping function for the date and startDate fields of the ExamTimetableItem db table.
 * Deeper explanation on the ExaminationTimetableItem mapping decisions found here:
 * https://pins-ds.atlassian.net/wiki/spaces/AS2/pages/1775894531/Changes+to+the+ExaminationTimetableItem+table
 *
 * @param {*} examinationTimetableItem
 * @param {string} timetableType
 */
export const mapExaminationTimetableItemDateTime = (
	examinationTimetableItem,
	timetableType
) => {
	console.log({
		examinationTimetableItem,
		timetableType
	})
	switch (timetableType) {
		case examTimetableItemTypes.ACCOMPANIED_SITE_INSPECTION:
			 return mapCompulsoryDateOptionalTimes(examinationTimetableItem);
		case examTimetableItemTypes.COMPULSORY_ACQUISITION_HEARING:
		case examTimetableItemTypes.DEADLINE:
		case examTimetableItemTypes.DEADLINE_FOR_CLOSE_OF_EXAMINATION:
		case examTimetableItemTypes.ISSUED_BY:
		case examTimetableItemTypes.ISSUE_SPECIFIC_HEARING:
		case examTimetableItemTypes.OPEN_FLOOR_HEARING:
		case examTimetableItemTypes.OTHER_MEETING:
		case examTimetableItemTypes.PRELIMINARY_MEETING:
		case examTimetableItemTypes.PROCEDURAL_DEADLINE:
		case examTimetableItemTypes.PROCEDURAL_DECISION:
		case examTimetableItemTypes.PUBLICATION_OF:
		default:
			// return {
			// 	date: new Date(examinationTimetableItem.date).toISOString(),
			// 	startDate: new Date(examinationTimetableItem.startDate).toISOString()
			// }
	}
};

const mapCompulsoryDateOptionalTimes = ({ startDate, date, startTime, endTime }) => {
	if (!startTime && !endTime) {
		return {
			startDate, date
		}
	} else if (startTime && !endTime) {
		const [hours, minutes] = splitTimeElement(startTime);
		startDate = new Date(date).setHours(
			Number(hours),
			Number(minutes)
		);
		return {
			startDate: new Date(startDate).toISOString(),
			date,
		}
	} else if (!startTime && endTime) {
		const [hours, minutes] = splitTimeElement(endTime);
		date = new Date(date).setHours(
			Number(hours),
			Number(minutes)
		)
		return {
			date: new Date(date).toISOString(),
			startDate: null,
		}
	} else {
		const [startHours, startMinutes] = splitTimeElement(startTime);
		const [endHours, endMinutes] = splitTimeElement(endTime);
		startDate = new Date(date).setHours(
			Number(startHours),
			Number(startMinutes)
		);
		date = new Date(date).setHours(
			Number(endHours),
			Number(endMinutes)
		);
		return {
			startDate: new Date(startDate).toISOString(),
			date: new Date(date).toISOString()
		}
	}
};

/**
 *
 * @param {string} timeString
 * @returns {[string, string]}
 */
const splitTimeElement = (timeString) => {
	const timeElements = timeString.split(':');
	return [timeElements[0], timeElements[1]];
};
