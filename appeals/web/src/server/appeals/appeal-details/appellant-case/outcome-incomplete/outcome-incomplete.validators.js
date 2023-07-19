import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createDateInputValidator } from '../../../../lib/validators/date-input.validator.js';

export const validateIncompleteReason = createValidator(
	body('incompleteReason')
		.exists()
		.withMessage('Please select one or more reasons why the appeal is incomplete')
		.bail()
		.notEmpty()
		.withMessage('Please select one or more reasons why the appeal is incomplete'),
	body('otherReason')
		.if(
			body().custom((value) => {
				if (Array.isArray(value.incompleteReason)) {
					return value.incompleteReason.includes(value.otherReasonId);
				} else {
					return value.incompleteReason === value.otherReasonId;
				}
			})
		)
		.notEmpty()
		.withMessage('If selecting "Other", you must provide details in the text box')
		.bail()
		.isString()
		.withMessage('something went wrong')
);

export const validateUpdateDueDate = createDateInputValidator('due-date');
