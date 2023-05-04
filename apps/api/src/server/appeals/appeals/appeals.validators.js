import { composeMiddleware } from '@pins/express';
import { param, query } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';

/**
 * @param {string} value
 * @returns {boolean}
 */
const hasValue = (value) => !!value;

/**
 * @param {string} value
 * @returns {boolean}
 */
const isGreaterThanZero = (value) => Number(value) >= 1;

/**
 * @param {string} pageNumber
 * @param {string} pageSize
 * @returns {string}
 */
const hasPageNumberAndPageSize = (pageNumber, pageSize) => pageNumber && pageSize;

/**
 * @param {string} parameterName
 * @returns {import('express-validator').ValidationChain}
 */
const validatePaginationParameter = (parameterName) =>
	query(parameterName)
		.if(hasValue)
		.isInt()
		.withMessage('Must be a number')
		.custom(isGreaterThanZero)
		.withMessage('Must be greater than 0')
		.custom((value, { req }) =>
			hasPageNumberAndPageSize(req.query?.pageNumber, req.query?.pageSize)
		)
		.withMessage('Both pageNumber and pageSize are required for pagination');

const validateAppealId = composeMiddleware(
	param('appealId').isInt().withMessage('Appeal id must be a number'),
	validationErrorHandler
);

const validatePaginationParameters = composeMiddleware(
	validatePaginationParameter('pageNumber'),
	validatePaginationParameter('pageSize'),
	validationErrorHandler
);

export { validateAppealId, validatePaginationParameters };
