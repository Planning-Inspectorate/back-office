import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createValidationDateValid } from '../../common/validators/dates.validators.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * Dispatch the POST route to the right validator
 *
 * @type {RequestHandler}
 */
export const validatorsDispatcher = async (request, response, next) => {
	const { templateType } = request.body;

	// starttime-mandatory (name, date, mandatory start time, optional endtime, optional description)

	/** @type {Record<string, RequestHandler>} */
	const validators = {
		'starttime-mandatory': validateStartTimeMandatory
	};

	if (validators[templateType]) {
		return validators[templateType](request, response, next);
	}

	return next();
};

const itemNameValidation = body('itemName')
	.trim()
	.isLength({ min: 1 })
	.withMessage('You must enter the item name')
	.isLength({ max: 200 })
	.withMessage('The item name must be 200 characters or fewer');

/**
 *
 * @param {import('@pins/express').Request} request
 * @returns {import("express-validator").ValidationChain}
}
 */
export const dateValidation = (request) => {
	const fieldName = 'date';
	const extendedFieldName = 'item date';

	const { 'date.day': day, 'date.month': month, 'date.year': year } = request.body;

	const checkValidDate = createValidationDateValid(fieldName, extendedFieldName, {
		day,
		month,
		year
	});

	return checkValidDate;
};

/**
 * Check date is valid and in the past
 *
 * @type {RequestHandler}
 */
export const validateStartTimeMandatory = (request, response, next) => {
	return createValidator([itemNameValidation, dateValidation(request)])(request, response, next);
};
