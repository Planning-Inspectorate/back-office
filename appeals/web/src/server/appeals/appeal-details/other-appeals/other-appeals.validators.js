import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateAddOtherAppealsReference = createValidator(
	body('addOtherAppealsReference').trim().notEmpty().withMessage('Enter an appeal reference')
);

export const validateRelateAppealAnswer = createValidator(
	body('relateAppealsAnswer')
		.trim()
		.notEmpty()
		.withMessage('You must answer if you want to relate appeals')
);
