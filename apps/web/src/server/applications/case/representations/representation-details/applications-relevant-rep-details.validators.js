import { createValidator } from '@pins/express';
import { body } from 'express-validator';

const validateOnBehalfOf = () => {
	return [
		body('onBehalfOf').custom((_, { req: { body } }) => {
			if (!body.represented.type && !body.representative.type)
				throw new Error('Enter on behalf of');

			return true;
		})
	];
};

export const representationDetailsValidation = [
	createValidator(
		body('represented.address.postcode').notEmpty().withMessage('Enter address details')
	),
	createValidator(
		body('represented.contactMethod').notEmpty().withMessage('Enter preferred method of contact')
	),
	createValidator(body('type').notEmpty().withMessage('Enter type')),
	createValidator(
		body('represented.under18')
			.exists({
				checkNull: false
			})
			.withMessage('Enter Under 18')
	),
	createValidator(validateOnBehalfOf()),
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
