import { composeMiddleware } from '@pins/express';
import { body, query } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
} from '../constants.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateUuidParameter from '#common/validators/uuid-parameter.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */
/** @typedef {import('express').Request} Request */

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
 * @param {string} parameterName
 * @returns {ValidationChain}
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

const getAppealsValidator = composeMiddleware(
	validatePaginationParameter('pageNumber'),
	validatePaginationParameter('pageSize'),
	query('searchTerm')
		.optional()
		.isString()
		.isLength({ min: 2, max: 8 })
		.withMessage(ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS),
	validationErrorHandler
);

const getAppealValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validationErrorHandler
);

const patchAppealValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateDateParameter({ parameterName: 'startedAt' }),
	validateUuidParameter({ parameterName: 'caseOfficer', parameterType: body, isRequired: false }),
	validateUuidParameter({ parameterName: 'inspector', parameterType: body, isRequired: false }),
	validationErrorHandler
);

export { getAppealsValidator, getAppealValidator, patchAppealValidator };
