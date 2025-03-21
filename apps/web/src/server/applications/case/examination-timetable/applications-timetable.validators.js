import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import {
	validationDateMandatory,
	validationDateStartBeforeEnd,
	validationDateValid,
	validationIncludeStartDateIfStartTime
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

/**
 * @param {Record<string, string>} data
 * @param {boolean} isMandatory
 * @returns {ValidationChain[]}
 */
const descriptionValidationChain = (data, isMandatory) =>
	isMandatory
		? [
				body('description')
					.trim()
					.isLength({ min: 1 })
					.withMessage('You must enter the timetable item description')
					.custom((value) => {
						if (!value.includes('*')) {
							throw new Error(
								'You must use a bullet point for each deadline item denoted by an asterisk'
							);
						}
						const regex = /^[^*]*[a-zA-Z][^*]*\*/ms;
						if (!regex.test(value)) {
							throw new Error(
								'You must enter the deadline description before the deadline item(s)'
							);
						}
						return true;
					})
		  ]
		: [];

/** @type {Record<string, ValidationChainsCallback>} */
const fieldValidationsCreators = {
	name: () => nameValidationChain,
	date: dateValidationChains({ fieldName: 'date', extendedFieldName: 'item date' }),
	startDate: dateValidationChains({ fieldName: 'startDate', extendedFieldName: 'item start date' }),
	endDate: dateValidationChains({ fieldName: 'endDate', extendedFieldName: 'item end date' }),
	startTime: timeValidationChains({ fieldName: 'startTime', extendedFieldName: 'item start time' }),
	endTime: timeValidationChains({ fieldName: 'endTime', extendedFieldName: 'item end time' }),
	description: descriptionValidationChain
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

	if (
		['deadline', 'deadline-for-close-of-examination', 'procedural-deadline'].includes(templateType)
	) {
		templateValidations.push(validationIncludeStartDateIfStartTime(request.body));
	}

	if (!['issued-by', 'publication-of'].includes(templateType)) {
		templateValidations.push(validationDateStartBeforeEnd(request.body));
	}

	if (templateValidations.length > 0) {
		return createValidator(templateValidations)(request, response, next);
	}

	return next();
};

export const nameWelshValidator = createValidator(
	body('nameWelsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter item name in Welsh')
		.isLength({ max: 200 })
		.withMessage('Item name in Welsh must be 200 characters or less')
);

export const descriptionWelshValidator = createValidator(
	body('descriptionWelsh')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter item description in Welsh')
);
