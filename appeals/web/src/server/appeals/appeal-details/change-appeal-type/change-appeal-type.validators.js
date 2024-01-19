import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	createDateInputFieldsValidator,
	createDateInputDateValidityValidator,
	createDateInputDateInFutureValidator,
	createDateInputDateBusinessDayValidator
} from '#lib/validators/date-input.validator.js';

export const validateAppealType = createValidator(
	body('appealType').trim().notEmpty().withMessage('Please choose an appeal type')
);

export const validateResubmitAppeal = createValidator(
	body('appealResubmit')
		.trim()
		.notEmpty()
		.withMessage('Please specify if the appeal should be resubmitted')
);

export const validateChangeAppealFinalDate = createValidator(
	body('appealType').trim().notEmpty().withMessage('Please choose an appeal type')
);

export const validateChangeAppealFinalDateFields = createDateInputFieldsValidator(
	'change-appeal-final-date',
	'final date'
);
export const validateChangeAppealFinalDateValid = createDateInputDateValidityValidator(
	'change-appeal-final-date',
	'final date'
);
export const validateChangeAppealFinalDateInFuture = createDateInputDateInFutureValidator(
	'change-appeal-final-date'
);

export const validateChangeAppealFinalDateIsBusinessDay =
	await createDateInputDateBusinessDayValidator('change-appeal-final-date');
