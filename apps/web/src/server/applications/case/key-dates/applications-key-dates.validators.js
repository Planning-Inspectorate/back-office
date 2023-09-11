import { createValidator } from '@pins/express';
import { validationDateValid } from '../../common/validators/dates.validators.js';
import { keyDatesProperty } from '../../../lib/nunjucks-filters/key-dates-property.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * Validate key dates are in the MM/DD/YYYY format
 *
 * @type {RequestHandler}
 */
export const validateKeyDates = async (request, response, next) => {
	const { body } = request;

	const allValidations = Object.keys(body)
		// exclude all the not-date fields
		.filter((key) => key.indexOf('year') > 1)
		.map((key) => {
			// infer the field name
			const fieldName = key.replace('.year', '');
			const extendedFieldName = keyDatesProperty(fieldName);

			// only check date validity (MM/DD/YYYY)
			// exclude other checks such as future/past dates
			return validationDateValid({ fieldName, extendedFieldName }, request.body);
		});

	return createValidator(allValidations)(request, response, next);
};
