import { add, addBusinessDays, isAfter, isBefore, sub } from 'date-fns';
import fetch from 'node-fetch';
import appealRepository from '../../repositories/appeal.repository.js';
import config from '../config.js';
import {
	BANK_HOLIDAY_FEED_DIVISION_ENGLAND,
	BANK_HOLIDAY_FEED_URL,
	ERROR_NOT_FOUND
} from '../constants.js';

/**
 * @typedef {import('@pins/appeals.api').Appeals.BankHolidayFeedEvents} BankHolidayFeedEvents
 * @typedef {import('@pins/appeals.api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate
 * @typedef {import('@pins/appeals.api').Appeals.BankHolidayFeedDivisions} BankHolidayFeedDivisions
 */

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
		const bankHolidayFeed = await fetch(BANK_HOLIDAY_FEED_URL);
		const bankHolidayFeedJson = await bankHolidayFeed.json();

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
const recalculateDeadlineForBankHolidays = (dateFrom, dateTo, bankHolidays) => {
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
					let bankHolidayCount = 0;

					({ bankHolidayCount, calculatedDate } = recalculateDeadlineForBankHolidays(
						startedAt,
						calculatedDate,
						bankHolidays
					));

					while (bankHolidayCount > 0) {
						({ bankHolidayCount, calculatedDate } = recalculateDeadlineForBankHolidays(
							calculatedDate,
							calculatedDate,
							bankHolidays
						));
					}

					return [fieldName, calculatedDate];
				})
			);
		}
	}
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object | void>}
 */
const checkAppealExistsAndAddToRequest = async (req, res, next) => {
	const {
		params: { appealId }
	} = req;
	const appeal = await appealRepository.getById(Number(appealId));

	if (!appeal) {
		return res.status(404).send({ errors: { appealId: ERROR_NOT_FOUND } });
	}

	req.appeal = appeal;
	next();
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object | void>}
 */
const checkLPAQuestionnaireExists = async (req, res, next) => {
	const {
		appeal,
		params: { lpaQuestionnaireId }
	} = req;
	const hasLPAQuestionnaire = appeal.lpaQuestionnaire?.id === Number(lpaQuestionnaireId);

	if (!hasLPAQuestionnaire) {
		return res.status(404).send({ errors: { lpaQuestionnaireId: ERROR_NOT_FOUND } });
	}

	next();
};

export { calculateTimetable, checkAppealExistsAndAddToRequest, checkLPAQuestionnaireExists };
