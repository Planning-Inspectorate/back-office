import { composeMiddleware } from '@pins/express';
import { body, param, query } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import {
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
} from '../constants.js';

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
 * @returns {boolean}
 */
const hasPageNumberAndPageSize = (pageNumber, pageSize) => !!(pageNumber && pageSize);

/**
 * @param {string} value
 * @returns {string}
 */
const joinDateAndTime = (value) => `${value}T01:00:00.000Z`;

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

const validateAppealId = param('appealId').isInt().withMessage(ERROR_MUST_BE_NUMBER);

const getAppealValidator = composeMiddleware(validateAppealId, validationErrorHandler);

const paginationParameterValidator = composeMiddleware(
	validatePaginationParameter('pageNumber'),
	validatePaginationParameter('pageSize'),
	validationErrorHandler
);

const patchAppealValidator = composeMiddleware(
	validateAppealId,
	body('startedAt')
		.optional()
		.isDate()
		.withMessage(ERROR_MUST_BE_CORRECT_DATE_FORMAT)
		.customSanitizer(joinDateAndTime),
	validationErrorHandler
);

export { getAppealValidator, paginationParameterValidator, patchAppealValidator };
