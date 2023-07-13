import { add, addBusinessDays, isAfter, isBefore, isWeekend, parseISO, sub } from 'date-fns';
import fetch from 'node-fetch';
import appealRepository from '../../repositories/appeal.repository.js';
import config from '../../config/config.js';
import {
	APPEAL_TYPE_SHORTCODE_FPA,
	BANK_HOLIDAY_FEED_DIVISION_ENGLAND,
	DEFAULT_TIMESTAMP_TIME,
	ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS,
	ERROR_NOT_FOUND,
	ERROR_OTHER_NOT_VALID_REASONS_REQUIRED,
	VALIDATION_OUTCOME_COMPLETE,
	VALIDATION_OUTCOME_INCOMPLETE,
	VALIDATION_OUTCOME_INVALID,
	VALIDATION_OUTCOME_VALID
} from '../constants.js';

/**
 * @typedef {import('@pins/appeals.api').Appeals.BankHolidayFeedEvents} BankHolidayFeedEvents
 * @typedef {import('@pins/appeals.api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate
 * @typedef {import('@pins/appeals.api').Appeals.BankHolidayFeedDivisions} BankHolidayFeedDivisions
 * @typedef {import('@pins/appeals.api').Appeals.NotValidReasons} NotValidReasons
 * @typedef {import('@pins/appeals.api').Schema.AppealType} AppealType
 * @typedef {import('express').NextFunction} NextFunction
 * @typedef {import('express').Request} Request
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
 * @param {string} fieldName
 * @param {string} databaseTable
 * @param {string} errorMessage
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<object | void>}
 */
const checkLookupValueIsValidAndAddToRequest =
	(fieldName, databaseTable, errorMessage) => async (req, res, next) => {
		const { [fieldName]: lookupField } = req.body;

		if (lookupField) {
			const validationOutcomeMatch = await appealRepository.getLookupListValueByName(
				databaseTable,
				lookupField
			);

			if (!validationOutcomeMatch) {
				return res.status(400).send({
					errors: {
						[fieldName]: errorMessage
					}
				});
			}

			// @ts-ignore
			req[fieldName] = validationOutcomeMatch;
		}

		next();
	};

/**
 *
 * @param {{
 *  data: NotValidReasons
 *  relationOne: string
 *  relationTwo: string
 *  relationOneId: number
 * }} param0
 * @returns
 */
const createManyToManyRelationData = ({ data, relationOne, relationTwo, relationOneId }) =>
	data.map((item) => ({
		[relationOne]: relationOneId,
		[relationTwo]: Number(item)
	}));

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
const isOutcomeComplete = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, VALIDATION_OUTCOME_COMPLETE);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeIncomplete = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, VALIDATION_OUTCOME_INCOMPLETE);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeInvalid = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, VALIDATION_OUTCOME_INVALID);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeValid = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, VALIDATION_OUTCOME_VALID);

/**
 * @param {string} value
 * @returns {string}
 */
const joinDateAndTime = (value) => `${value}T${DEFAULT_TIMESTAMP_TIME}Z`;

export {
	calculateTimetable,
	checkAppealExistsAndAddToRequest,
	checkAppellantCaseExists,
	checkLPAQuestionnaireExists,
	checkLookupValuesAreValid,
	checkLookupValueIsValidAndAddToRequest,
	createManyToManyRelationData,
	fetchBankHolidaysForDivision,
	isFPA,
	isOutcomeComplete,
	isOutcomeIncomplete,
	isOutcomeInvalid,
	isOutcomeValid,
	joinDateAndTime,
	recalculateDateIfNotBusinessDay
};
