import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { dateIsValid, dateIsInTheFuture } from '../dates.js';
import { capitalize } from 'lodash-es';

export const createDateInputValidator = (
	fieldNamePrefix = 'date',
	messageFieldNamePrefix = 'date'
) =>
	createValidator(
		body(`${fieldNamePrefix}-day`)
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}day cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}day must be a number`
				)
			)
			.bail()
			.isLength({ min: 1, max: 2 })
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}day must be 1 or 2 digits`
				)
			)
			.bail()
			.matches(/^0?[1-9]$|^1\d$|^2\d$|^3[01]$/)
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}day must be between 1 and 31`
				)
			),
		body(`${fieldNamePrefix}-month`)
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}month cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}month must be a number`
				)
			)
			.bail()
			.isLength({ min: 1, max: 2 })
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}month must be 1 or 2 digits`
				)
			)
			.bail()
			.matches(/^0?[1-9]$|^1[0-2]$/)
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}month must be between 1 and 12`
				)
			),
		body(`${fieldNamePrefix}-year`)
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}year cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}year must be a number`
				)
			)
			.bail()
			.isLength({ min: 4, max: 4 })
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}year must be 4 digits`
				)
			),
		body()
			.custom((bodyFields) => {
				const day = bodyFields[`${fieldNamePrefix}-day`];
				const month = bodyFields[`${fieldNamePrefix}-month`];
				const year = bodyFields[`${fieldNamePrefix}-year`];

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
			.custom((bodyFields) => {
				const day = bodyFields[`${fieldNamePrefix}-day`];
				const month = bodyFields[`${fieldNamePrefix}-month`];
				const year = bodyFields[`${fieldNamePrefix}-year`];

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
