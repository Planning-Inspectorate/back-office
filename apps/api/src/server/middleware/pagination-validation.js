import { composeMiddleware } from '@pins/express';
import { query } from 'express-validator';
import { validationErrorHandler } from './error-handler.js';
import { ERROR_MUST_BE_GREATER_THAN_ZERO, ERROR_MUST_BE_NUMBER } from './errors.js';
import { hasAllProperties } from '../utils/object.js';

/**
 * @param {string} value
 * @returns {boolean}
 */
const hasValue = (value) => Boolean(value);

/**
 * @param {string} value
 * @returns {boolean}
 */
const isGreaterThanZero = (value) => Number(value) >= 1;

/**
 * @typedef {Object} PaginationOptions
 * @property {string} [options.page] page parameter name, default 'page'
 * @property {string} [options.pageSize] pageSie parameter name, default 'pageSize'
 */

/**
 * @param {string} parameterName
 * @param {PaginationOptions} [options]
 * @returns {import('express-validator').ValidationChain}
 */
const validatePaginationParameter = (
	parameterName,
	{ page = 'page', pageSize = 'pageSize' } = {}
) =>
	query(parameterName)
		.if(hasValue)
		.isInt()
		.withMessage(ERROR_MUST_BE_NUMBER)
		.custom(isGreaterThanZero)
		.withMessage(ERROR_MUST_BE_GREATER_THAN_ZERO)
		.custom((value, { req }) => hasAllProperties(req.query, page, pageSize))
		.withMessage(`Both ${page} and ${pageSize} are required for pagination`);

/**
 * @param {PaginationOptions} [options]
 * @returns {import('express').RequestHandler|import('express').ErrorRequestHandler}
 */
export function validatePaginationParameters({ page = 'page', pageSize = 'pageSize' } = {}) {
	return composeMiddleware(
		validatePaginationParameter(page, { page, pageSize }),
		validatePaginationParameter(pageSize, { page, pageSize }),
		validationErrorHandler
	);
}
