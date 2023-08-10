import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { capitalize } from 'lodash-es';

export const createTimeInputValidator = (
	fieldNamePrefix = 'time',
	messageFieldNamePrefix = 'time'
) =>
	createValidator(
		body(`${fieldNamePrefix}-hour`)
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}hour cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}hour must be a number`
				)
			)
			.bail()
			.isInt({ min: 0, max: 23 })
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}hour cannot be less than 0 or greater than 23`
				)
			),
		body(`${fieldNamePrefix}-minute`)
			.trim()
			.notEmpty()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}minute cannot be empty`
				)
			)
			.bail()
			.isInt()
			.withMessage(
				capitalize(
					`${(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''}minute must be a number`
				)
			)
			.bail()
			.isInt({ min: 0, max: 59 })
			.withMessage(
				capitalize(
					`${
						(messageFieldNamePrefix && messageFieldNamePrefix + ' ') || ''
					}minute cannot be less than 0 or greater than 59`
				)
			)
	);
