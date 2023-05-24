import { composeMiddleware } from '@pins/express';
import { query } from 'express-validator';
import { validationErrorHandler } from './error-handler.js';
import {
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
} from './errors.js';

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
 * @param {string} pageNumber
 * @param {string} pageSize
 * @returns {boolean}
 */
const hasPageNumberAndPageSize = (pageNumber, pageSize) => Boolean(pageNumber && pageSize);

/**
 * @param {string} parameterName
 * @returns {import('express-validator').ValidationChain}
 */
const validatePaginationParameter = (parameterName) =>
	query(parameterName)
		.if(hasValue)
		.isInt()
		.withMessage(ERROR_MUST_BE_NUMBER)
		.custom(isGreaterThanZero)
		.withMessage(ERROR_MUST_BE_GREATER_THAN_ZERO)
		.custom((value, { req }) =>
			hasPageNumberAndPageSize(req.query?.pageNumber, req.query?.pageSize)
		)
		.withMessage(ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED);

export const validatePaginationParameters = composeMiddleware(
	validatePaginationParameter('pageNumber'),
	validatePaginationParameter('pageSize'),
	validationErrorHandler
);
