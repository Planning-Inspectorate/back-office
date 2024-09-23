import { examTimetableItemTypes } from './constants.js';

/**
 * Mapping function for the date and startDate fields of the ExamTimetableItem db table.
 * Deeper explanation on the ExaminationTimetableItem mapping decisions found here:
 * https://pins-ds.atlassian.net/wiki/spaces/AS2/pages/1775894531/Changes+to+the+ExaminationTimetableItem+table
 *
 * @param {*} examinationTimetableItem
 * @param {import('@prisma/client').ExaminationTimetableType | null} examinationTimetableType
 */
export const mapExaminationTimetableItemDateTime = (
	examinationTimetableItem,
	examinationTimetableType
) => {
	switch (examinationTimetableType?.templateType) {
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
			break;
	}
};

const mapCompulsoryDateOptionalTimes = (examinationTimetableItem) => {
	if (!examinationTimetableItem.startTime && !examinationTimetableItem.endTime) {
		return examinationTimetableItem;
	}
	if (examinationTimetableItem.startTime && !examinationTimetableItem.endTime) {
		const [hours, minutes] = splitTimeElement(examinationTimetableItem.startTime);
		const startDate = new Date(examinationTimetableItem.date).setHours(
			Number(hours),
			Number(minutes)
		);
		examinationTimetableItem.startDate = new Date(startDate).toISOString();
		return examinationTimetableItem;
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
