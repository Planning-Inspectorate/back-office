import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createTextareaValidator } from '../../../../lib/validators/textarea-validator.js';

export const validateInvalidReason = createValidator(
	body('invalidReason')
		.exists()
		.withMessage('Please select one or more reasons why the appeal is invalid')
		.bail()
		.notEmpty()
		.withMessage('Please select one or more reasons why the appeal is invalid'),
	body('otherReason')
		.if(
			body().custom((value) => {
				if (Array.isArray(value.invalidReason)) {
					return value.invalidReason.includes(value.otherReasonId);
				} else {
					return value.invalidReason === value.otherReasonId;
				}
			})
		)
		.notEmpty()
		.withMessage('If selecting "Other", you must provide details in the text box')
		.bail()
		.isString()
		.withMessage('something went wrong')
);

export const validateTextArea = createTextareaValidator(
	'otherReason',
	'Text in "List any other reasons" must not exceed {{maximumCharacters}} characters'
);
