import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateAddNeighbouringSite = createValidator(
	body('addressLine1').trim().notEmpty().withMessage('Enter the first line of the address'),
	body('town').trim().notEmpty().withMessage('Enter the town'),
	body('postCode')
		.trim()
		.notEmpty()
		.withMessage('Enter postcode')
		.bail()
		.custom((postcode) => {
			const regex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gm;

			return postcode.match(regex);
		})
		.withMessage('Invalid postcode')
);
