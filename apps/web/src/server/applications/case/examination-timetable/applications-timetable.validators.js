import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { createValidationDateValid } from '../../common/validators/dates.validators.js';
import {
	createValidationTimeMandatory,
	createValidationTimeValid
} from '../../common/validators/times.validators.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import("express-validator").ValidationChain} ValidationChain */

/**
 * Dispatch the POST route to the right validator
 *
 * @type {RequestHandler}
 */
export const validatorsDispatcher = async (request, response, next) => {
	const { templateType } = request.body;

	// starttime-mandatory (name, date, mandatory start time, optional endtime, optional description)

	// set the list of validators to run for each template type
	/** @type {Record<string, ValidationChain[]>} */
	const templateValidators = {
		'starttime-mandatory': [
			itemNameValidation,
			dateValidation(request),
			...startTimeValidation(request, true)
		]
	};

	if (templateValidators[templateType]) {
		return createValidator(templateValidators[templateType])(request, response, next);
	}

	return next();
};

/** Validators */

const itemNameValidation = body('itemName')
	.trim()
	.isLength({ min: 1 })
	.withMessage('You must enter the item name')
	.isLength({ max: 200 })
	.withMessage('The item name must be 200 characters or fewer');

/**
 *
 * @param {import('@pins/express').Request} request
 * @returns {ValidationChain}
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
 *
 * @param {import('@pins/express').Request} request
 * @param {boolean} isMandatory
 * @returns {ValidationChain[]}
}
 */
export const startTimeValidation = (request, isMandatory) => {
	const fieldName = 'startTime';
	const extendedFieldName = 'item start time';

	const { 'startTime.hours': hours, 'startTime.minutes': minutes } = request.body;

	const checkValidTime = createValidationTimeValid(fieldName, extendedFieldName, {
		hours,
		minutes
	});

	if (isMandatory) {
		const checkTimeIsProvided = createValidationTimeMandatory(fieldName, extendedFieldName, {
			hours,
			minutes
		});

		return [checkValidTime, checkTimeIsProvided];
	}

	return [checkValidTime];
};
