import { body } from 'express-validator';
import { createValidator } from '@pins/express';
import { dateValidator } from './utils/date-validator.js';
import { receivedDateKeys } from './config.js';
import { dateReceivedValidator } from './utils/received-date-validator.js';

const validateDate = dateValidator({
	dayInput: receivedDateKeys.day,
	monthInput: receivedDateKeys.month,
	yearInput: receivedDateKeys.year,
	dateInputContainerId: receivedDateKeys.date
});

const validateWholeDate = dateReceivedValidator(
	{
		dayInput: receivedDateKeys.day,
		monthInput: receivedDateKeys.month,
		yearInput: receivedDateKeys.year,
		inputPrefix: receivedDateKeys.date
	},
	'Date received'
);

const validateOriginalRepresentation = createValidator(
	body('originalRepresentation')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a comment')
		.isLength({ max: 65324 })
		.withMessage('Comment must be 65,324 characters or less')
);

export const representationCommentValidation = [
	validateOriginalRepresentation,
	validateDate,
	validateWholeDate
];
