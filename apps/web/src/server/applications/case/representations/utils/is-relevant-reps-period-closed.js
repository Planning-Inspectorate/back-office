import { isDatePastToday } from '../../../../lib/dates.js';
import { isValid, fromUnixTime } from 'date-fns';

/**
 * @param {*} date
 * @returns { boolean }
 */
export const isDateValid = (date) => {
	if (
		date !== null &&
		date !== '0000-00-00' &&
		(isValid(new Date(date)) || isValid(fromUnixTime(date)))
	) {
		return true;
	}
	return false;
};

/**
 * @param {*} originalDate
 * @param {*} extensionDate
 * @returns
 */
export const getRelevantRepsCloseDateOrNull = (originalDate, extensionDate) => {
	/**
	 * @type {*}
	 */
	let result = null;

	if (isDateValid(originalDate)) {
		result = originalDate;
	}
	if (isDateValid(extensionDate)) {
		result = extensionDate;
	}

	return result ? fromUnixTime(result) : result;
};

/**
 * @param {*} dateOfRelevantRepresentationClose
 * @param {*} extensionToDateRelevantRepresentationsClose
 * @returns { boolean }
 */
export const isRelevantRepsPeriodClosed = (
	dateOfRelevantRepresentationClose,
	extensionToDateRelevantRepresentationsClose
) => {
	const actualCloseDate = getRelevantRepsCloseDateOrNull(
		dateOfRelevantRepresentationClose,
		extensionToDateRelevantRepresentationsClose
	);

	return isDatePastToday(actualCloseDate);
};
