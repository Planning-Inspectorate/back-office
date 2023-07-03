import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const checkAnswersValidation = [
	createValidator(
		body('represented.address.postcode').notEmpty().withMessage('Enter address details')
	),
	createValidator(
		body('represented.contactMethod').notEmpty().withMessage('Enter preferred method of contact')
	),
	createValidator(body('type').notEmpty().withMessage('Enter type')),
	createValidator(body('represented.under18').notEmpty().withMessage('Enter Under 18')),
	createValidator(body('represented.type').notEmpty().withMessage('Enter on behalf of')),
	createValidator(
		body('representative.firstName').notEmpty().withMessage('Enter agent contact details')
	),
	createValidator(
		body('representative.address.postcode').notEmpty().withMessage('Enter agent address details')
	),
	createValidator(
		body('representative.contactMethod')
			.notEmpty()
			.withMessage('Enter agent preferred method of contact')
	),
	createValidator(body('originalRepresentation').notEmpty().withMessage('Enter representation'))
];
