import { add, addBusinessDays, isAfter, isBefore, sub } from 'date-fns';
import fetch from 'node-fetch';
import appealRepository from '../../repositories/appeal.repository.js';
import config from '../config.js';
import {
	APPEAL_TYPE_SHORTCODE_FPA,
	BANK_HOLIDAY_FEED_DIVISION_ENGLAND,
	BANK_HOLIDAY_FEED_URL,
	ERROR_INVALID_VALIDATION_OUTCOME,
	ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS,
	ERROR_NOT_FOUND,
	ERROR_OTHER_NOT_VALID_REASONS_REQUIRED,
	APPELLANT_CASE_VALIDATION_OUTCOME_INCOMPLETE,
	APPELLANT_CASE_VALIDATION_OUTCOME_INVALID,
	APPELLANT_CASE_VALIDATION_OUTCOME_VALID
} from '../constants.js';

/**
 * @typedef {import('@pins/api').Appeals.BankHolidayFeedEvents} BankHolidayFeedEvents
 * @typedef {import('@pins/api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate
 * @typedef {import('@pins/api').Appeals.BankHolidayFeedDivisions} BankHolidayFeedDivisions
 * @typedef {import('@pins/api').Schema.AppealType} AppealType
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('express').RequestHandler} RequestHandler
 * @typedef {import('express').Response} Response
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
 * @type {RequestHandler}
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
 * @type {RequestHandler}
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

/**
 * @type {RequestHandler}
 * @returns {Promise<object | void>}
 */
const checkAppellantCaseExists = async (req, res, next) => {
	const {
		appeal,
		params: { appellantCaseId }
	} = req;
	const hasAppellantCase = appeal.appellantCase?.id === Number(appellantCaseId);

	if (!hasAppellantCase) {
		return res.status(404).send({ errors: { appellantCaseId: ERROR_NOT_FOUND } });
	}

	next();
};

/**
 * @param {string} fieldName
 * @param {string} databaseTable
 * @returns {(req: {
 * 	 body: {
 * 		 [key: string]: string | string[],
 *     otherNotValidReasons: string
 *     validationOutcome: string
 *   }
 * }, res: Response, next: NextFunction) => Promise<object | void>}
 */
const checkLookupValuesAreValid = (fieldName, databaseTable) => async (req, res, next) => {
	const {
		body: { otherNotValidReasons }
	} = req;
	let {
		body: { [fieldName]: valuesToCheck }
	} = req;

	if (valuesToCheck) {
		valuesToCheck = typeof valuesToCheck !== 'object' ? [valuesToCheck] : valuesToCheck;

		const lookupValues = await appealRepository.getLookupList(databaseTable);
		const lookupValueOtherId = lookupValues.find(({ name }) => name === 'Other')?.id;

		if (
			lookupValueOtherId &&
			valuesToCheck.some((valueToCheck) => Number(valueToCheck) === lookupValueOtherId) &&
			!otherNotValidReasons
		) {
			return res
				.status(400)
				.send({ errors: { otherNotValidReasons: ERROR_OTHER_NOT_VALID_REASONS_REQUIRED } });
		}

		const lookupValueIds = lookupValues.map(({ id }) => id);
		const hasValidValues = valuesToCheck.every((valueToCheck) =>
			lookupValueIds.includes(Number(valueToCheck))
		);

		if (!hasValidValues) {
			return res.status(404).send({ errors: { [fieldName]: ERROR_NOT_FOUND } });
		}

		if (
			lookupValueOtherId &&
			valuesToCheck.every((valueToCheck) => Number(valueToCheck) !== lookupValueOtherId) &&
			otherNotValidReasons
		) {
			return res.status(400).send({
				errors: { otherNotValidReasons: ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS }
			});
		}
	}

	next();
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object | void>}
 */
const checkValidationOutcomeExistsAndAddToRequest = async (req, res, next) => {
	const {
		body: { validationOutcome }
	} = req;
	const validationOutcomeMatch = await appealRepository.getValidationOutcomeByName(
		validationOutcome
	);

	if (!validationOutcomeMatch) {
		return res.status(400).send({
			errors: {
				validationOutcome: ERROR_INVALID_VALIDATION_OUTCOME
			}
		});
	}

	req.validationOutcome = validationOutcomeMatch;

	next();
};

/**
 * @param {Pick<AppealType, 'shorthand'> | null} appealType
 * @returns {boolean}
 */
const isFPA = (appealType) =>
	Boolean(appealType && appealType.shorthand === APPEAL_TYPE_SHORTCODE_FPA);

/**
 * @param {string} validationOutcomeParameter
 * @param {string} validationOutcomeConstant
 * @returns {boolean}
 */
const compareValidationOutcome = (validationOutcomeParameter, validationOutcomeConstant) =>
	validationOutcomeParameter.toLowerCase() === validationOutcomeConstant.toLowerCase();

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isAppellantCaseIncomplete = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, APPELLANT_CASE_VALIDATION_OUTCOME_INCOMPLETE);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isAppellantCaseInvalid = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, APPELLANT_CASE_VALIDATION_OUTCOME_INVALID);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isAppellantCaseValid = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, APPELLANT_CASE_VALIDATION_OUTCOME_VALID);

export {
	calculateTimetable,
	checkAppealExistsAndAddToRequest,
	checkAppellantCaseExists,
	checkLPAQuestionnaireExists,
	checkValidationOutcomeExistsAndAddToRequest,
	checkLookupValuesAreValid,
	isFPA,
	isAppellantCaseIncomplete,
	isAppellantCaseInvalid,
	isAppellantCaseValid
};
