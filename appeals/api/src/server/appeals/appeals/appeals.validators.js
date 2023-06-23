import { composeMiddleware } from '@pins/express';
import { body, param, query } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import {
	ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME,
	ERROR_INVALID_REASONS_ONLY_FOR_INVALID_OUTCOME,
	ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	ERROR_MAX_LENGTH_300,
	ERROR_MUST_BE_ARRAY_OF_IDS,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
} from '../constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from './appeals.service.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

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

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateIdParameter = (parameterName) =>
	param(parameterName).isInt().withMessage(ERROR_MUST_BE_NUMBER);

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateDateParameter = (parameterName) =>
	body(parameterName)
		.optional()
		.isDate()
		.withMessage(ERROR_MUST_BE_CORRECT_DATE_FORMAT)
		.customSanitizer(joinDateAndTime);

/**
 *
 * @param {string} parameterName
 * @param {() => void} customFn
 * @returns {ValidationChain}
 */
const validateValidationOutcomeReasons = (parameterName, customFn) =>
	body(parameterName)
		.optional()
		.isArray()
		.withMessage(ERROR_MUST_BE_ARRAY_OF_IDS)
		.isLength({ min: 1 })
		.withMessage(ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE)
		.custom(customFn);

const getAppealValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validationErrorHandler
);

const getLPAQuestionnaireValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('lpaQuestionnaireId'),
	validationErrorHandler
);

const getAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantCaseId'),
	validationErrorHandler
);

const paginationParameterValidator = composeMiddleware(
	validatePaginationParameter('pageNumber'),
	validatePaginationParameter('pageSize'),
	validationErrorHandler
);

const patchAppealValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateDateParameter('startedAt'),
	validationErrorHandler
);

const patchAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantCaseId'),
	// @ts-ignore
	validateValidationOutcomeReasons('incompleteReasons', (value, { req }) => {
		if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
			throw new Error(ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME);
		}

		return value;
	}),
	// @ts-ignore
	validateValidationOutcomeReasons('invalidReasons', (value, { req }) => {
		if (value && !isOutcomeInvalid(req.body.validationOutcome)) {
			throw new Error(ERROR_INVALID_REASONS_ONLY_FOR_INVALID_OUTCOME);
		}

		return value;
	}),
	body('otherNotValidReasons')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.isLength({ min: 0, max: 300 })
		.withMessage(ERROR_MAX_LENGTH_300)
		.custom((value, { req }) => {
			if (
				value &&
				!isOutcomeIncomplete(req.body.validationOutcome) &&
				!isOutcomeInvalid(req.body.validationOutcome)
			) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS);
			}

			return value;
		}),
	body('validationOutcome')
		.isString()
		.custom((value, { req }) => {
			if (isOutcomeIncomplete(value) && !req.body.incompleteReasons) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED);
			}

			if (isOutcomeInvalid(value) && !req.body.invalidReasons) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED);
			}

			return value;
		}),
	validationErrorHandler
);

const patchLPAQuestionnaireValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('lpaQuestionnaireId'),
	// @ts-ignore
	validateValidationOutcomeReasons('incompleteReasons', (value, { req }) => {
		if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
			throw new Error(ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME);
		}

		return value;
	}),
	body('otherNotValidReasons')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.isLength({ min: 0, max: 300 })
		.withMessage(ERROR_MAX_LENGTH_300)
		.custom((value, { req }) => {
			if (
				value &&
				!isOutcomeIncomplete(req.body.validationOutcome) &&
				!isOutcomeInvalid(req.body.validationOutcome)
			) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS);
			}

			return value;
		}),
	body('validationOutcome')
		.isString()
		.custom((value, { req }) => {
			if (isOutcomeIncomplete(value) && !req.body.incompleteReasons) {
				throw new Error(ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED);
			}

			return value;
		}),
	validateDateParameter('lpaQuestionnaireDueDate'),
	validationErrorHandler
);

export {
	getAppealValidator,
	getAppellantCaseValidator,
	getLPAQuestionnaireValidator,
	paginationParameterValidator,
	patchAppealValidator,
	patchAppellantCaseValidator,
	patchLPAQuestionnaireValidator
};
