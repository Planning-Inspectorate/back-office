import got from 'got';
import { addBusinessDays, isAfter, isBefore, sub, add } from 'date-fns';

/**
 * @typedef {Object} BankHoliday
 * @property {string} date
 */

/**
 * @typedef {Array<BankHoliday>} BankHolidays
 */

/**
 * @param {string} division
 * @returns {Promise<BankHolidays>}
 */
const getBankHolidays = async (division = 'england-and-wales') => {
	try {
		const bankHolidaysResponse = await got.get('https://www.gov.uk/bank-holidays.json').json();

		return bankHolidaysResponse[division].events;
	} catch (/** @type {*} */ error) {
		throw new Error(`Unable to retrieve bank holidays`);
	}
};

/**
 * @param {Date} dateFrom
 * @param {Date} dateWithBusinessDaysAdded
 * @param {BankHolidays} bankHolidays
 * @returns {Number}
 */
const getNumberOfBankHolidaysBetweenDates = (dateFrom, dateWithBusinessDaysAdded, bankHolidays) =>
	bankHolidays.filter(
		({ date }) =>
			isAfter(new Date(date), sub(new Date(dateFrom), { days: 1 })) &&
			isBefore(new Date(date), add(new Date(dateWithBusinessDaysAdded), { days: 1 }))
	).length;

/**
 * @param {Date} dateFrom
 * @param {Number} businessDaysToAdd
 * @param {BankHolidays} bankHolidays
 * @returns {Date}
 */
const getDateWithBusinessDaysAdded = (dateFrom, businessDaysToAdd, bankHolidays) => {
	let dateWithBusinessDaysAdded = addBusinessDays(dateFrom, businessDaysToAdd);

	let bankHolidayCount = 0;

	bankHolidayCount = getNumberOfBankHolidaysBetweenDates(
		dateFrom,
		dateWithBusinessDaysAdded,
		bankHolidays
	);

	while (bankHolidayCount > 0) {
		const recalculatedDateWithBankHolidaysAdded = addBusinessDays(
			dateWithBusinessDaysAdded,
			bankHolidayCount
		);

		bankHolidayCount = getNumberOfBankHolidaysBetweenDates(
			add(new Date(dateWithBusinessDaysAdded), { days: 1 }),
			recalculatedDateWithBankHolidaysAdded,
			bankHolidays
		);

		dateWithBusinessDaysAdded = recalculatedDateWithBankHolidaysAdded;
	}

	return dateWithBusinessDaysAdded;
};

/**
 * @param {Date} dateFrom
 * @param {Number} businessDaysToAdd
 * @param {string} division
 * @returns {Promise<Date>}
 */
const addBusinessDaysToDate = async (dateFrom, businessDaysToAdd, division) => {
	const bankHolidays = await getBankHolidays(division);

	return getDateWithBusinessDaysAdded(dateFrom, businessDaysToAdd, bankHolidays);
};

export default { addBusinessDaysToDate };
