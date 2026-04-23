/**
 * @file applications-key-dates.validators.js
 * @description Validation middleware for the key dates form submission.
 *
 * Used by the POST handler in the key dates router to validate user input
 * before the controller attempts to save data to the API.
 *
 * Validation rules:
 *   - All date fields (identified by a `.year` component in the field name) are
 *     validated for correct format using `validationDateValid`.
 *   - If `courtDecisionOutcome` is set to "Other", the `courtDecisionOutcomeText`
 *     field is required and must not be empty.
 *
 * Errors are collected and attached to `request.errors` by `createValidator`,
 * which the controller then uses to re-render the form with inline error messages.
 */

import { body } from 'express-validator';
import { createValidator } from '@pins/express';
import { validationDateValid } from '../../common/validators/dates.validators.js';
import { keyDatesProperty } from '../../../lib/nunjucks-filters/key-dates-property.js';

/** @typedef {import('@pins/express/types/express.d.ts').AsyncRequestHandler} AsyncRequestHandler */

/**
 * Validate key dates form submission.
 *
 * Validates:
 * 1. All date fields are in valid dd/mm/yyyy format
 * 2. Court decision outcome radio button (if provided) is one of 4 valid options
 * 3. If "Other" outcome selected, the custom text field is not empty
 *
 * @type {AsyncRequestHandler}
 */
export const validateKeyDates = async (request, response, next) => {
	const { body: requestBody } = request;

	const allValidations = Object.keys(requestBody)
		// exclude all the not-date fields
		.filter((key) => key.indexOf('year') > 1)
		.map((key) => {
			// infer the field name
			const fieldName = key.replace('.year', '');
			const extendedFieldName = keyDatesProperty(fieldName);

			// only check date validity (MM/DD/YYYY)
			// exclude other checks such as future/past dates
			return validationDateValid({ fieldName, extendedFieldName }, requestBody);
		});

	if (requestBody.courtDecisionOutcome === 'Other') {
		allValidations.push(
			body('courtDecisionOutcomeText')
				.trim()
				.notEmpty()
				.withMessage('Enter the court decision outcome')
		);
	}

	return createValidator(allValidations)(request, response, next);
};
