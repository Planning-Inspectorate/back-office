import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	validationDateMandatory,
	validationDateValid
} from '../../common/validators/dates.validators.js';
import {
	validationTimeMandatory,
	validationTimeValid
} from '../../common/validators/times.validators.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import("express-validator").ValidationChain} ValidationChain */

/**
 *
 * @callback ValidationChainsCallback
 * @param {Record<string, string>} data
 * @param {boolean} isMandatory
 * @returns {ValidationChain[]}
 */

/** Validators */

const nameValidationChains = [
	body('itemName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter the item name')
		.isLength({ max: 200 })
		.withMessage('The item name must be 200 characters or fewer')
];

/**
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @returns {ValidationChainsCallback}
 */
const timeValidationChains = (fieldName, extendedFieldName) => {
	return (data, isMandatory) => [
		validationTimeValid({ fieldName, extendedFieldName }, data),
		...(isMandatory ? [validationTimeMandatory({ fieldName, extendedFieldName }, data)] : [])
	];
};

/**
 * @param {string} fieldName
 * @param {string} extendedFieldName
 * @returns {ValidationChainsCallback}
 */
const dateValidationChains = (fieldName, extendedFieldName) => {
	return (data, isMandatory) => [
		validationDateValid({ fieldName, extendedFieldName }, data),
		...(isMandatory ? [validationDateMandatory({ fieldName, extendedFieldName }, data)] : [])
	];
};

/** @type {Record<string, ValidationChainsCallback>} */
const fieldValidationsCreators = {
	name: () => nameValidationChains,
	dateTime: dateValidationChains('date', 'item date'),
	startTime: timeValidationChains('startTime', 'item start time'),
	endTime: timeValidationChains('endTime', 'item end time')
};

/** @type {Record<string, Record<string, boolean>>} */
const schema = {
	'starttime-mandatory': {
		name: true,
		date: true,
		startTime: true,
		endTime: false,
		description: false
	}
};

/**
 * Dispatch the POST route to the right validator
 *
 * @type {RequestHandler}
 */
export const validatorsDispatcher = async (request, response, next) => {
	const templateValidations = [];
	const { templateType } = request.body;
	const allowedFields = schema[templateType];

	for (const fieldName in allowedFields) {
		if (fieldValidationsCreators[fieldName]) {
			const isMandatory = allowedFields[fieldName];
			const getFieldValidations = fieldValidationsCreators[fieldName];
			const fieldValidations = getFieldValidations(request.body, isMandatory);

			templateValidations.push(...fieldValidations);
		}
	}

	if (templateValidations.length > 0) {
		return createValidator(templateValidations)(request, response, next);
	}

	return next();
};
