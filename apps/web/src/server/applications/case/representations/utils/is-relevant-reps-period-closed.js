import { isPast, endOfDay, isValid, fromUnixTime } from 'date-fns';

/**
 * @param {*} date
 * @returns { boolean }
 */
const isDateValid = (date) => {
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
const getRelevantRepsCloseDateOrFalse = (originalDate, extensionDate) => {
	/**
	 * @type {*}
	 */
	let result = false;

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
 * @returns {Promise<boolean>}
 */
export const isRelevantRepsPeriodClosed = (
	dateOfRelevantRepresentationClose,
	extensionToDateRelevantRepresentationsClose
) => {
	const actualCloseDate = getRelevantRepsCloseDateOrFalse(
		dateOfRelevantRepresentationClose,
		extensionToDateRelevantRepresentationsClose
	);
	return actualCloseDate && isPast(endOfDay(actualCloseDate));
};
