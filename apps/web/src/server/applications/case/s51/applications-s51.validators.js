import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	validationDateFuture,
	validationDateMandatory,
	validationDateValid
} from '../../common/validators/dates.validators.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * Dispatch the POST route to the right validator
 *
 * @type {RequestHandler}
 */
export const s51ValidatorsDispatcher = async (request, response, next) => {
	const { step } = request.params;

	/** @type {Record<string, RequestHandler>} */
	const validators = {
		title: validateS51Title,
		enquirer: validateS51Enquirer,
		method: validateS51Method,
		'enquiry-details': validateS51Details('enquiry', 'enquiry details'),
		person: validateS51Person,
		'advice-details': validateS51Details('advice', 'advice given')
	};

	if (validators[step]) {
		return validators[step](request, response, next);
	}

	return next();
};

export const validateS51Title = createValidator(
	body('title')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a S51 advice title')
		.isLength({ max: 255 })
		.withMessage('The name must be 255 characters or fewer')
);

export const validateS51Method = createValidator(
	body('enquiryMethod')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must select a method of enquiry')
);

export const validateS51Person = createValidator(
	body('adviser').trim().isLength({ min: 1 }).withMessage('You must enter a name')
);

/**
 * Check name, last name and organisation exist and are valid
 *
 * @type {RequestHandler}
 */
export const validateS51Enquirer = (request, response, next) => {
	const checkNotNull = body('all')
		.custom((_, { req }) => {
			const body = req.body;
			const allEmpty = !(
				!body.enquirerFirstName &&
				!body.enquirerLastName &&
				!body.enquirerOrganisation
			);

			return allEmpty;
		})
		.withMessage('You must enter either a name, organisation or both');

	const checkLastNameIfFirstName = body('enquirerLastName')
		.custom((_, { req }) => {
			const body = req.body;
			const lastNameNotDefined = !(!!body.enquirerFirstName && !body.enquirerLastName);

			return lastNameNotDefined;
		})
		.withMessage('You must enter a last name');

	const checkFirstNameIfLastName = body('enquirerFirstName')
		.custom((_, { req }) => {
			const body = req.body;
			const firstNameNotDefined = !(!body.enquirerFirstName && !!body.enquirerLastName);

			return firstNameNotDefined;
		})
		.withMessage('You must enter a first name');

	return createValidator([checkNotNull, checkLastNameIfFirstName, checkFirstNameIfLastName])(
		request,
		response,
		next
	);
};

/**
 * Check date is valid and in the past and details are provided
 *
 * @param {string} fieldName
 * @param {string} extendedDetailsFieldName
 * @returns {RequestHandler}
 */
export const validateS51Details =
	(fieldName, extendedDetailsFieldName) => (request, response, next) => {
		const dateFieldName = `${fieldName}Date`;

		const detailsFieldName = `${fieldName}Details`;

		const checkMandatoryDate = validationDateMandatory(
			{ fieldName: dateFieldName, extendedFieldName: 'date' },
			request.body
		);

		const checkValidDate = validationDateValid(
			{ fieldName: dateFieldName, extendedFieldName: 'date' },
			request.body
		);

		const checkPastDate = validationDateFuture(
			{ fieldName: dateFieldName, extendedFieldName: 'date' },
			request.body,
			false,
			false
		);

		const checkEnquiryDetails = createValidator(
			body(detailsFieldName)
				.trim()
				.isLength({ min: 1 })
				.withMessage(`You must enter the ${extendedDetailsFieldName}`)
		);

		return createValidator([
			checkMandatoryDate,
			checkValidDate,
			checkPastDate,
			checkEnquiryDetails
		])(request, response, next);
	};
