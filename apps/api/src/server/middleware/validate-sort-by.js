import { composeMiddleware } from '@pins/express';
import { query } from 'express-validator';
import { validationErrorHandler } from './error-handler.js';
import { ERROR_INVALID_SORT_BY, ERROR_INVALID_SORT_BY_OPTION } from './errors.js';

/**
 *
 * @param {string[]} options
 * @param {string} value
 * @returns
 */
export function validateSortByValue(options, value) {
	console.log('value', value);
	const first = value[0];
	if (first !== '-' && first !== '+') {
		throw new Error(ERROR_INVALID_SORT_BY);
	}
	const field = value.substring(1);
	if (!options.includes(field)) {
		throw new Error(ERROR_INVALID_SORT_BY_OPTION);
	}
	return true;
}

/**
 *
 * @param {string[]} options
 * @param {string} [parameterName]
 */
export function validateSortBy(options, parameterName = 'sortBy') {
	return composeMiddleware(
		query(parameterName)
			.optional()
			.isString()
			.notEmpty()
			.withMessage(ERROR_INVALID_SORT_BY)
			.custom((value) => validateSortByValue(options, value)),
		validationErrorHandler
	);
}
