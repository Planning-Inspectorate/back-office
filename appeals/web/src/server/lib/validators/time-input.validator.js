import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { capitalize } from 'lodash-es';

export const createTimeInputValidator = (
	fieldNamePrefix = 'time',
	messageFieldNamePrefix = 'time',
	// @ts-ignore
	// eslint-disable-next-line no-unused-vars
	continueValidationCondition = (value) => true
) =>
	createValidator(
		body(`${fieldNamePrefix}-hour`)
			.if(continueValidationCondition)
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
			.if(continueValidationCondition)
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

export const createStartTimeBeforeEndTimeValidator = (
	startTimeFieldNamePrefix = 'startTime',
	endTimeFieldNamePrefix = 'endTime',
	startTimeMessageFieldNamePrefix = 'start time',
	endTimeMessageFieldNamePrefix = 'end time',
	// @ts-ignore
	// eslint-disable-next-line no-unused-vars
	continueValidationCondition = (value) => true
) =>
	createValidator(
		body()
			.if(continueValidationCondition)
			.custom((bodyFields) => {
				const startTimeHour = parseInt(bodyFields[`${startTimeFieldNamePrefix}-hour`], 10);
				const startTimeMinute = parseInt(bodyFields[`${startTimeFieldNamePrefix}-minute`], 10);
				const endTimeHour = parseInt(bodyFields[`${endTimeFieldNamePrefix}-hour`], 10);
				const endTimeMinute = parseInt(bodyFields[`${endTimeFieldNamePrefix}-minute`], 10);

				return (
					!Number.isNaN(startTimeHour) &&
					!Number.isNaN(startTimeMinute) &&
					!Number.isNaN(endTimeHour) &&
					!Number.isNaN(endTimeMinute) &&
					startTimeHour + startTimeMinute < endTimeHour + endTimeMinute
				);
			})
			.withMessage(
				`${startTimeMessageFieldNamePrefix} must be before ${endTimeMessageFieldNamePrefix}`
			)
	);
