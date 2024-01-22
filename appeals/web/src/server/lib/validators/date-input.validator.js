import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { dateIsValid, dateIsInTheFuture, dateIsTodayOrInThePast } from '../dates.js';
import { capitalize } from 'lodash-es';

export const createDateInputFieldsValidator = (
	fieldNamePrefix = 'date',
	messageFieldNamePrefix = 'date',
	dayFieldName = '-day',
	monthFieldName = '-month',
	yearFieldName = '-year'
) =>
	createValidator(
		body(`${fieldNamePrefix}${dayFieldName}`)
			.exists()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' d') || 'D'}ay cannot be empty`
				)
			)
			.bail()
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' d') || 'D'}ay cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' d') || 'D'}ay must be a number`
				)
			)
			.bail()
			.isLength({ min: 1, max: 2 })
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' d') || 'D'
					}ay must be 1 or 2 digits`
				)
			)
			.bail()
			.matches(/^0?[1-9]$|^1\d$|^2\d$|^3[01]$/)
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' d') || 'D'
					}ay must be between 1 and 31`
				)
			),
		body(`${fieldNamePrefix}${monthFieldName}`)
			.exists()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' m') || 'M'}onth cannot be empty`
				)
			)
			.bail()
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' m') || 'M'}onth cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' m') || 'M'}onth must be a number`
				)
			)
			.bail()
			.isLength({ min: 1, max: 2 })
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' m') || 'M'
					}onth must be 1 or 2 digits`
				)
			)
			.bail()
			.matches(/^0?[1-9]$|^1[0-2]$/)
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' m') || 'M'
					}onth must be between 1 and 12`
				)
			),
		body(`${fieldNamePrefix}${yearFieldName}`)
			.exists()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' y') || 'Y'}ear cannot be empty`
				)
			)
			.bail()
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' y') || 'Y'}ear cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' y') || 'Y'}ear must be a number`
				)
			)
			.bail()
			.isLength({ min: 4, max: 4 })
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' y') || 'Y'}ear must be 4 digits`
				)
			)
	);

export const createDateInputDateValidityValidator = (
	fieldNamePrefix = 'date',
	messageFieldNamePrefix = 'date',
	dayFieldName = '-day',
	monthFieldName = '-month',
	yearFieldName = '-year'
) =>
	createValidator(
		body()
			.custom((bodyFields) => {
				const day = bodyFields[`${fieldNamePrefix}${dayFieldName}`];
				const month = bodyFields[`${fieldNamePrefix}${monthFieldName}`];
				const year = bodyFields[`${fieldNamePrefix}${yearFieldName}`];

				if (!day || !month || !year) {
					return false;
				}

				const dayNumber = Number.parseInt(day, 10);
				const monthNumber = Number.parseInt(month, 10);
				const yearNumber = Number.parseInt(year, 10);

				return dateIsValid(yearNumber, monthNumber, dayNumber);
			})
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}must be a valid date`
				)
			)
	);

/**
 * @param {import('got').Got} apiClient
 * @param {string} value
 * @returns {Promise<boolean>}
 */
const dateIsABusinessDay = async (apiClient, value) => {
	try {
		const result = await apiClient
			.post(`appeals/validate-business-date`, {
				json: { inputDate: value }
			})
			.json();
		return result;
	} catch {
		return false;
	}
};

export const createDateInputDateBusinessDayValidator = async (
	fieldNamePrefix = 'date',
	messageFieldNamePrefix = 'date',
	dayFieldName = '-day',
	monthFieldName = '-month',
	yearFieldName = '-year'
) =>
	await createValidator(
		body()
			.custom(async (bodyFields, { req }) => {
				const day = bodyFields[`${fieldNamePrefix}${dayFieldName}`];
				const month = bodyFields[`${fieldNamePrefix}${monthFieldName}`];
				const year = bodyFields[`${fieldNamePrefix}${yearFieldName}`];

				if (!day || !month || !year) {
					return false;
				}

				const dayNumber = Number.parseInt(day, 10);
				const monthNumber = Number.parseInt(month, 10);
				const yearNumber = Number.parseInt(year, 10);

				const dateToValidate = new Date(yearNumber, monthNumber - 1, dayNumber)
					.toISOString()
					.split('T')[0];

				const result = await dateIsABusinessDay(req.apiClient, dateToValidate);
				if (result === false) {
					return Promise.reject();
				}
				return result;
			})
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}must be a business day`
				)
			)
	);

export const createDateInputDateInFutureValidator = (
	fieldNamePrefix = 'date',
	messageFieldNamePrefix = 'date',
	dayFieldName = '-day',
	monthFieldName = '-month',
	yearFieldName = '-year'
) =>
	createValidator(
		body()
			.custom((bodyFields) => {
				const day = bodyFields[`${fieldNamePrefix}${dayFieldName}`];
				const month = bodyFields[`${fieldNamePrefix}${monthFieldName}`];
				const year = bodyFields[`${fieldNamePrefix}${yearFieldName}`];

				if (!day || !month || !year) {
					return false;
				}

				const dayNumber = Number.parseInt(day, 10);
				const monthNumber = Number.parseInt(month, 10);
				const yearNumber = Number.parseInt(year, 10);

				return dateIsInTheFuture(yearNumber, monthNumber, dayNumber);
			})
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}must be a date in the future`
				)
			)
	);

export const createDateInputDateInPastOrTodayValidator = (
	fieldNamePrefix = 'date',
	messageFieldNamePrefix = 'date',
	dayFieldName = '-day',
	monthFieldName = '-month',
	yearFieldName = '-year'
) =>
	createValidator(
		body()
			.custom((bodyFields) => {
				const day = bodyFields[`${fieldNamePrefix}${dayFieldName}`];
				const month = bodyFields[`${fieldNamePrefix}${monthFieldName}`];
				const year = bodyFields[`${fieldNamePrefix}${yearFieldName}`];

				if (!day || !month || !year) {
					return false;
				}

				const dayNumber = Number.parseInt(day, 10);
				const monthNumber = Number.parseInt(month, 10);
				const yearNumber = Number.parseInt(year, 10);

				return dateIsTodayOrInThePast(yearNumber, monthNumber, dayNumber);
			})
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}must be today or in the past`
				)
			)
	);
