import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateLookupPostcode = createValidator(
	body('lookupPostcode')
		.notEmpty()
		.withMessage('Enter a postcode')
		.isLength({ min: 1, max: 16 })
		.withMessage('Postcode must be between 1 and 16 characters')
		.isPostalCode('GB')
		.withMessage('Enter a valid postcode')
);

export const validateAddress = createValidator(
	body('address').notEmpty().withMessage('Chose an address from the list')
);

export const validateAddressLineOne = createValidator(
	body('addressLine1')
		.notEmpty()
		.withMessage('Enter address line 1')
		.isLength({ min: 1, max: 255 })
		.withMessage('Address line 1 must be 255 characters or less')
);

export const validateAddressLineTwo = createValidator(
	body('addressLine2')
		.isLength({ min: 0, max: 96 })
		.withMessage('Address line 2 must be 96 characters or less')
);

export const validateAddressTown = createValidator(
	body('town')
		.isLength({ min: 0, max: 64 })
		.withMessage('Town or city must be 64 characters or less')
);

export const validateAddressPostcode = createValidator(
	body('postcode')
		.notEmpty()
		.withMessage('Enter a postcode')
		.isLength({ min: 1, max: 16 })
		.withMessage('Postcode must be between 1 and 16 characters')
		.isPostalCode('GB')
		.withMessage('Enter a valid postcode')
);

export const validateAddressCountry = createValidator(
	body('country')
		.notEmpty()
		.withMessage('Enter a country')
		.isLength({ min: 1, max: 64 })
		.withMessage('Country must be 64 characters or less')
);
