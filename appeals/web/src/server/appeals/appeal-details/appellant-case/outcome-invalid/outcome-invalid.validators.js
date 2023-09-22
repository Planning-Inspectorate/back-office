import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createTextareaValidator } from '../../../../lib/validators/textarea-validator.js';

export const validateInvalidReason = createValidator(
	body('invalidReason')
		.exists()
		.withMessage('Please select one or more reasons why the appeal is invalid')
		.bail()
		.notEmpty()
		.withMessage('Please select one or more reasons why the appeal is invalid')
);

export const validateTextArea = createTextareaValidator(
	'otherReason',
	'Text in "List any other reasons" must not exceed {{maximumCharacters}} characters'
);
