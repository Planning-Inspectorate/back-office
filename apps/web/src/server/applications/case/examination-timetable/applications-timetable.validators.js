import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	validationDateMandatory,
	validationDateStartBeforeEnd,
	validationDateValid
} from '../../common/validators/dates.validators.js';
import {
	validationTimeMandatory,
	validationTimeValid
} from '../../common/validators/times.validators.js';
import { timetableTemplatesSchema } from './applications-timetable.controller.js';

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

const nameValidationChain = [
	body('name')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter the item name')
		.isLength({ max: 200 })
		.withMessage('The item name must be 200 characters or fewer')
];

/**
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @returns {ValidationChainsCallback}
 */
const timeValidationChains = (field) => {
	return (data, isMandatory) => [
		validationTimeValid(field, data),
		...(isMandatory ? [validationTimeMandatory(field, data)] : [])
	];
};

/**
 * @param {{fieldName: string, extendedFieldName: string}} field
 * @returns {ValidationChainsCallback}
 */
const dateValidationChains = (field) => {
	return (data, isMandatory) => [
		validationDateValid(field, data),
		...(isMandatory ? [validationDateMandatory(field, data)] : [])
	];
};

/** @type {Record<string, ValidationChainsCallback>} */
const fieldValidationsCreators = {
	name: () => nameValidationChain,
	date: dateValidationChains({ fieldName: 'date', extendedFieldName: 'item date' }),
	startDate: dateValidationChains({ fieldName: 'startDate', extendedFieldName: 'item start date' }),
	endDate: dateValidationChains({ fieldName: 'endDate', extendedFieldName: 'item end date' }),
	startTime: timeValidationChains({ fieldName: 'startTime', extendedFieldName: 'item start time' }),
	endTime: timeValidationChains({ fieldName: 'endTime', extendedFieldName: 'item end time' })
};

/**
 * Dispatch the POST route to the right validator
 *
 * @type {RequestHandler}
 */
export const validatorsDispatcher = async (request, response, next) => {
	const templateValidations = [];
	const { templateType } = request.body;
	const allowedFields = timetableTemplatesSchema[templateType];

	for (const fieldName in allowedFields) {
		if (fieldValidationsCreators[fieldName]) {
			const isMandatory = allowedFields[fieldName];
			const getFieldValidations = fieldValidationsCreators[fieldName];
			const fieldValidations = getFieldValidations(request.body, isMandatory);

			templateValidations.push(...fieldValidations);
		}
	}

	if (templateType !== 'no-times') {
		templateValidations.push(validationDateStartBeforeEnd(request.body));
	}

	if (templateValidations.length > 0) {
		return createValidator(templateValidations)(request, response, next);
	}

	return next();
};
