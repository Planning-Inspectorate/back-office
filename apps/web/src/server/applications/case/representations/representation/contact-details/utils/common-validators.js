import { createValidator } from '@pins/express';
import { body } from 'express-validator';

export const validateOrganisationName = createValidator(
	body('organisationName')
		.isLength({ min: 0, max: 255 })
		.withMessage('Name of organisation or charity must be 255 characters or less')
);

export const validateFirstName = createValidator([
	body('firstName')
		.notEmpty()
		.withMessage('Enter first name')
		.isLength({ min: 3, max: 64 })
		.withMessage('First name must be between 3 and 64 characters')
]);

export const validateLastName = createValidator([
	body('lastName')
		.notEmpty()
		.withMessage('Enter last name')
		.isLength({ min: 3, max: 64 })
		.withMessage('Last name must be between 3 and 64 characters')
]);

export const validateJobTitle = createValidator(
	body('jobTitle')
		.isLength({ min: 0, max: 64 })
		.withMessage('Job title or volunteer role must be 64 characters or less')
);

export const validateEmail = createValidator([
	body('email')
		.isLength({ min: 0, max: 255 })
		.withMessage('Email address must be 255 characters or less')
		.optional({ checkFalsy: true })
		.trim()
		.isEmail()
		.withMessage('Enter an email address in the correct format, like name@example.com')
]);

export const validatePhoneNumber = createValidator([
	body('phoneNumber')
		.isLength({ min: 0, max: 255 })
		.withMessage('Telephone number must be 255 characters or less')
		.optional({ checkFalsy: true })
		.trim()
		.isNumeric()
		.withMessage('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192')
]);
