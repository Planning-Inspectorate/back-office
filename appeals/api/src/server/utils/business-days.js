import { add, addBusinessDays, isAfter, isBefore, isWeekend, parseISO, sub } from 'date-fns';
import fetch from 'node-fetch';
import config from '../config/config.js';
import { BANK_HOLIDAY_FEED_DIVISION_ENGLAND } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.BankHolidayFeedEvents} BankHolidayFeedEvents */
/** @typedef {import('@pins/appeals.api').Appeals.BankHolidayFeedDivisions} BankHolidayFeedDivisions */
/** @typedef {import('@pins/appeals.api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate */

/**
 * Count the number of bank holidays between two dates
 *
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @param {BankHolidayFeedEvents} bankHolidays
 * @returns {number}
 */
const bankHolidaysBetweenDates = (dateFrom, dateTo, bankHolidays) =>
	bankHolidays.filter(
		({ date }) =>
			isAfter(new Date(date), sub(new Date(dateFrom), { days: 1 })) &&
			isBefore(new Date(date), add(new Date(dateTo), { days: 1 }))
	).length;

/**
 * @param {BankHolidayFeedDivisions} division
 * @returns {Promise<BankHolidayFeedEvents>}
 */
const fetchBankHolidaysForDivision = async (division = BANK_HOLIDAY_FEED_DIVISION_ENGLAND) => {
	try {
		const bankHolidayFeed = await fetch(config.bankHolidayFeed.hostname);
		const bankHolidayFeedJson = await bankHolidayFeed.json();

		// @ts-ignore
		return bankHolidayFeedJson[division].events;
	} catch (error) {
		throw new Error(String(error));
	}
};

/**
 * Add any bank holiday days in the date range to the deadline day
 *
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @param {BankHolidayFeedEvents} bankHolidays
 * @returns {{ bankHolidayCount: number, calculatedDate: Date }}
 */
const recalculateDateForBankHolidays = (dateFrom, dateTo, bankHolidays) => {
	const bankHolidayCount = bankHolidaysBetweenDates(dateFrom, dateTo, bankHolidays);

	if (bankHolidayCount) {
		return {
			bankHolidayCount,
			calculatedDate: addBusinessDays(new Date(dateTo), bankHolidayCount)
		};
	}

	return { bankHolidayCount, calculatedDate: new Date(dateTo) };
};

/**
 * @param {Date} startedAt
 * @param {Date} calculatedDate
 * @param {BankHolidayFeedEvents} bankHolidays
 * @returns {Date}
 */
const addBankHolidayDays = (startedAt, calculatedDate, bankHolidays) => {
	let bankHolidayCount = 0;

	({ bankHolidayCount, calculatedDate } = recalculateDateForBankHolidays(
		startedAt,
		calculatedDate,
		bankHolidays
	));

	while (bankHolidayCount > 0) {
		({ bankHolidayCount, calculatedDate } = recalculateDateForBankHolidays(
			calculatedDate,
			calculatedDate,
			bankHolidays
		));
	}

	return calculatedDate;
};

/**
 * @param {string} date
 * @returns {Date}
 */
const addWeekendDays = (date) => {
	let calculatedDate = parseISO(date);

	while (isWeekend(calculatedDate)) {
		calculatedDate = addBusinessDays(calculatedDate, 1);
	}

	return calculatedDate;
};

/**
 * @param {string} date
 * @returns {Promise<Date>}
 */
const recalculateDateIfNotBusinessDay = async (date) => {
	const bankHolidays = await fetchBankHolidaysForDivision();
	const calculatedDate = addWeekendDays(date);

	return addBankHolidayDays(calculatedDate, calculatedDate, bankHolidays);
};

/**
 * Calculates the timetable deadlines excluding weekends and bank holidays
 *
 * 1. The deadline day is calculated excluding weekends
 * 2. The number of bank holidays in the date range are added to the deadline day
 * 3. If the new deadline day (and any consecutive days) are bank holidays, these are added to the deadline day
 *
 * @param {string} appealType
 * @param {Date} startedAt
 * @returns {Promise<TimetableDeadlineDate | undefined>}
 */
const calculateTimetable = async (appealType, startedAt) => {
	if (startedAt) {
		const appealTimetableConfig = config.timetable[appealType];

		if (appealTimetableConfig) {
			const bankHolidays = await fetchBankHolidaysForDivision();

			return Object.fromEntries(
				Object.entries(appealTimetableConfig).map(([fieldName, { daysFromStartDate }]) => {
					let calculatedDate = addBusinessDays(new Date(startedAt), daysFromStartDate);
					calculatedDate = addBankHolidayDays(startedAt, calculatedDate, bankHolidays);

					return [fieldName, calculatedDate];
				})
			);
		}
	}
};

export { calculateTimetable, recalculateDateIfNotBusinessDay };
