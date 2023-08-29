import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createDateInputValidator } from '#lib/validators/date-input.validator.js';
import { createTimeInputValidator } from '#lib/validators/time-input.validator.js';

export const validateSiteVisitType = createValidator(
	body('visit-type').trim().notEmpty().withMessage('Please select a visit type')
);

export const validateVisitDate = createDateInputValidator('visit-date', 'visit date');
export const validateVisitStartTime = createTimeInputValidator(
	'visit-start-time',
	'start time',
	// @ts-ignore
	(value, { req }) => {
		return req.body['visit-type'] !== 'unaccompanied';
	}
);
export const validateVisitEndTime = createTimeInputValidator(
	'visit-end-time',
	'end time',
	// @ts-ignore
	(value, { req }) => {
		return req.body['visit-type'] !== 'unaccompanied';
	}
);
