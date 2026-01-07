import { createValidator } from '@pins/express';
import { validationDateValid } from '../../common/validators/dates.validators.js';
import { getSectionData } from './applications-fees-forecasting.utils.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * Calls specified validator function based on section name in request
 *
 * @type {RequestHandler}
 */
export const feesForecastingValidator = async (request, response, next) => {
	const { sectionName } = request.params;

	/** @type {Record<string, RequestHandler>} */
	const validators = {
		'maturity-evaluation-matrix': validateFeesForecastingDates
	};

	if (Object.keys(validators).includes(sectionName)) {
		const validator = validators[sectionName];
		if (validator && typeof validator === 'function') {
			return validator(request, response, next);
		}
	}

	return next();
};

/**
 * Checks dates are in MM/DD/YYYY format
 *
 * @type {RequestHandler}
 */
export const validateFeesForecastingDates = async (request, response, next) => {
	const { body, params } = request;
	const { sectionName } = params;

	const allValidations = Object.keys(body)
		.filter((key) => key.indexOf('year') > 1)
		.map((key) => {
			const fieldName = key.replace('.year', '');
			const section = getSectionData(sectionName);
			const extendedFieldName = section.pageTitle;

			return validationDateValid({ fieldName, extendedFieldName }, request.body);
		});

	return createValidator(allValidations)(request, response, next);
};
