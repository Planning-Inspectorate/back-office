import { examTimetableItemTypes } from './constants.js';

/**
 * @typedef {{ startDate: Date | null, date: Date, startTime: string | null, endTime: string | null }} ExaminationDateInputs
 * @typedef {{ date: string, startDate: string | null }} MappedExaminationDateOutputs
 */

/**
 * Mapping function for the date and startDate fields of the ExamTimetableItem db table.
 * Deeper explanation on the ExaminationTimetableItem mapping decisions found here:
 * https://pins-ds.atlassian.net/wiki/spaces/AS2/pages/1775894531/Changes+to+the+ExaminationTimetableItem+table
 *
 * @param {ExaminationDateInputs} examinationTimetableItem
 * @param {string} timetableType
 * @returns {MappedExaminationDateOutputs}
 */
export const mapExaminationTimetableItemDateTime = (examinationTimetableItem, timetableType) => {
	const timetableTypeMapping = {
		[examTimetableItemTypes.ACCOMPANIED_SITE_INSPECTION]: mapMandatoryDateAndOptionalTimes,
		[examTimetableItemTypes.COMPULSORY_ACQUISITION_HEARING]: mapMandatoryDateAndOptionalTimes,
		[examTimetableItemTypes.DEADLINE]: mapMandatoryEndDateTimesAndOptionalStartDateTimes,
		[examTimetableItemTypes.DEADLINE_FOR_CLOSE_OF_EXAMINATION]:
			mapMandatoryEndDateTimesAndOptionalStartDateTimes,
		[examTimetableItemTypes.ISSUED_BY]: mapMandatoryDateOnly,
		[examTimetableItemTypes.ISSUE_SPECIFIC_HEARING]: mapMandatoryDateAndOptionalTimes,
		[examTimetableItemTypes.OPEN_FLOOR_HEARING]: mapMandatoryDateAndOptionalTimes,
		[examTimetableItemTypes.OTHER_MEETING]: mapMandatoryDateAndOptionalTimes,
		[examTimetableItemTypes.PRELIMINARY_MEETING]: mapMandatoryDateAndStartTimeAndOptionalEndTime,
		[examTimetableItemTypes.PROCEDURAL_DEADLINE]: mapMandatoryEndDateTimesAndOptionalStartDateTimes,
		[examTimetableItemTypes.PROCEDURAL_DECISION]: mapMandatoryDateAndOptionalTimes,
		[examTimetableItemTypes.PUBLICATION_OF]: mapMandatoryDateOnly
	};

	const allowedKeys = Object.keys(timetableTypeMapping);
	if (!allowedKeys.includes(timetableType)) {
		throw new Error(`Unsupported examination timetable item type: ${timetableType}`);
	}
	const mapperFunction = timetableTypeMapping[timetableType];
	if (typeof mapperFunction !== 'function') {
		throw new Error(`Non-function type received from mapper: ${timetableType}`);
	}
	return mapperFunction(examinationTimetableItem);
};

/**
 * Maps the mandatory date and optional start and end times.
 * @param {ExaminationDateInputs} examinationTimetableItem
 * @returns {MappedExaminationDateOutputs}
 */
const mapMandatoryDateAndOptionalTimes = ({ startDate, date, startTime, endTime }) => {
	if (!startTime && !endTime) {
		return { startDate: null, date: new Date(date).toISOString() };
	} else if (startTime && !endTime) {
		startDate = setTimeOnDate(date, startTime);
		return {
			startDate: new Date(startDate).toISOString(),
			date: new Date(date).toISOString()
		};
	} else if (!startTime && endTime) {
		date = setTimeOnDate(date, endTime);
		return {
			date: new Date(date).toISOString(),
			startDate: null
		};
	} else {
		startDate = setTimeOnDate(date, startTime);
		date = setTimeOnDate(date, endTime);
		return {
			startDate: new Date(startDate).toISOString(),
			date: new Date(date).toISOString()
		};
	}
};

/**
 * Maps the mandatory end date and times and optional start date and times.
 * @param {ExaminationDateInputs} examinationTimetableItem
 * @returns {MappedExaminationDateOutputs}
 */
const mapMandatoryEndDateTimesAndOptionalStartDateTimes = ({
	startDate,
	date,
	startTime,
	endTime
}) => {
	if (!startDate && !startTime) {
		date = setTimeOnDate(date, endTime);
		return { startDate: null, date: new Date(date).toISOString() };
	} else if (!startDate) {
		startDate = setTimeOnDate(date, startTime);
		date = setTimeOnDate(date, endTime);
		return { startDate: new Date(startDate).toISOString(), date: new Date(date).toISOString() };
	} else if (startDate && !startTime) {
		date = setTimeOnDate(date, endTime);
		return {
			startDate: new Date(startDate).toISOString(),
			date: new Date(date).toISOString()
		};
	} else {
		date = setTimeOnDate(date, endTime);
		startDate = setTimeOnDate(startDate, startTime);
		return {
			startDate: new Date(startDate).toISOString(),
			date: new Date(date).toISOString()
		};
	}
};

/**
 * Maps the mandatory date only.
 * @param {ExaminationDateInputs} examinationTimetableItem
 * @returns {MappedExaminationDateOutputs}
 */
const mapMandatoryDateOnly = ({ date }) => {
	return {
		date: new Date(date).toISOString(),
		startDate: null
	};
};

/**
 * Maps the mandatory date and optional start and end times.
 * @param {ExaminationDateInputs} examinationTimetableItem
 * @returns {MappedExaminationDateOutputs}
 */
const mapMandatoryDateAndStartTimeAndOptionalEndTime = ({
	startDate,
	date,
	startTime,
	endTime
}) => {
	if (startTime && endTime) {
		date = setTimeOnDate(date, endTime);
		startDate = setTimeOnDate(date, startTime);
		return {
			startDate: new Date(startDate).toISOString(),
			date: new Date(date).toISOString()
		};
	} else {
		startDate = setTimeOnDate(date, startTime);
		return {
			startDate: new Date(startDate).toISOString(),
			date: new Date(date).toISOString()
		};
	}
};

/**
 *
 * @param {string | null} timeString
 * @returns {[string, string]}
 */
const splitTimeElement = (timeString) => {
	if (!timeString) return ['00', '00'];
	const timeElements = timeString?.split(':');
	return [timeElements[0], timeElements[1]];
};

/**
 * @param {Date} date
 * @param {string | null} time
 * @returns {Date}
 */
const setTimeOnDate = (date, time) => {
	const [hours, minutes] = splitTimeElement(time);
	const dateWithTime = new Date(date).setHours(Number(hours), Number(minutes));
	return new Date(dateWithTime);
};
