import { createValidator } from '@pins/express';
import { body } from 'express-validator';

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
	// BOAT-452: uncomment lines below to demonstrate addAnother component re-populating existing items and values from request.body on re-rendering page in error state
	// .isString()
	// .withMessage('otherReason is not a string')
);
