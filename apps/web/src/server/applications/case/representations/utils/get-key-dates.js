import { isPast, isValid, endOfDay, subDays } from 'date-fns';
import { getRelevantRepsCloseDateOrNull } from './is-relevant-reps-period-closed.js';
import { dateToDisplayDate, isDatePastToday } from '../../../../lib/dates.js';
import dateUtils from '../../../../lib/add-business-days-to-date.js';
import pino from '../../../../lib/logger.js';

/**
 * @param {string|null} publishedDate
 * @returns {boolean}
 */
const isPublished = (publishedDate) =>
	publishedDate !== null &&
	isValid(new Date(publishedDate)) &&
	isPast(endOfDay(subDays(new Date(publishedDate), 1)));

/**
 * @param {Date|false} closingDate
 * @returns {boolean}
 */
const isClosed = (closingDate) => closingDate && isDatePastToday(closingDate);

/**
 * @param {string|null} publishedDate
 * @param {Date|false} closingDate
 * @returns {string}
 */
const getState = (publishedDate, closingDate) => {
	let state = 'open';

	if (isPublished(publishedDate)) state = 'published';
	else if (isClosed(closingDate)) state = 'closed';

	return state;
};

/**
 * @param {Date} closingDate
 * @returns {Promise<Date|null>}
 */
const getReviewDate = async (closingDate) => {
	try {
		return isValid(closingDate)
			? await dateUtils.addBusinessDaysToDate(closingDate, 10, 'england-and-wales')
			: null;
	} catch (error) {
		pino.error(error);
		return null;
	}
};

/**
 * @typedef keyDates
 * @type {object}
 * @property {string} state
 * @property {string} publishedDate
 * @property {string} closingDate
 * @property {string} reviewDate
 */

/**
 * @param {string|null} publishedDate
 * @param {string|null} repsPeriodCloseDate
 * @param {string|null} repsPeriodCloseDateExtension
 * @returns {Promise<keyDates>}
 */
const getKeyDates = async (publishedDate, repsPeriodCloseDate, repsPeriodCloseDateExtension) => {
	const closingDate = getRelevantRepsCloseDateOrNull(
		repsPeriodCloseDate,
		repsPeriodCloseDateExtension
	);
	const reviewDate = await getReviewDate(closingDate);

	return {
		state: getState(publishedDate, closingDate),
		publishedDate: dateToDisplayDate(publishedDate),
		closingDate: dateToDisplayDate(closingDate),
		reviewDate: dateToDisplayDate(reviewDate)
	};
};

export { getKeyDates };
