import { createValidator } from '@pins/express';
import { validationDateValid } from '../../common/validators/dates.validators.js';
import { getSectionData } from './applications-fees-forecasting.utils.js';
import { sectionData, urlSectionNames } from './fees-forecasting.config.js';

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
		'maturity-evaluation-matrix': validateFeesForecastingDate,
		'scoping-submission': validateFeesForecastingDate,
		'consultation-milestone': validateFeesForecastingDate
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
export const validateFeesForecastingDate = async (request, response, next) => {
	const { body, params } = request;
	const { sectionName } = params;

	const section = getSectionData(sectionName, urlSectionNames, sectionData);
	const fieldName = section?.fieldName || '';
	const extendedFieldName = section?.sectionTitle || '';

	const validation = validationDateValid({ fieldName, extendedFieldName }, body);

	return createValidator([validation])(request, response, next);
};
