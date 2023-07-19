import { composeMiddleware } from '@pins/express';
import { body, query } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_LENGTH_BETWEEN_2_AND_8_CHARACTERS,
	ERROR_LPA_QUESTIONNAIRE_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	ERROR_MAX_LENGTH_300_CHARACTERS,
	ERROR_MUST_BE_ARRAY_OF_IDS,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_BE_STRING,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
} from '../constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from '#utils/check-validation-outcome.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateIdParameter from '#common/validators/id-parameter.js';

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
		.custom((value) => value[0])
		.withMessage(ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE)
		.custom(customFn);

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

const patchAppealValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateDateParameter('startedAt'),
	validationErrorHandler
);

const patchAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	// @ts-ignore
	validateDateParameter('appealDueDate', (value, { req }) => {
		if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
			throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
		}

		return value;
	}),
	validateIdParameter('appellantCaseId'),
	// @ts-ignore
	validateValidationOutcomeReasons('incompleteReasons', (value, { req }) => {
		if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
			throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
		}

		return value;
	}),
	// @ts-ignore
	validateValidationOutcomeReasons('invalidReasons', (value, { req }) => {
		if (value && !isOutcomeInvalid(req.body.validationOutcome)) {
			throw new Error(ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME);
		}

		return value;
	}),
	body('otherNotValidReasons')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.isLength({ min: 0, max: 300 })
		.withMessage(ERROR_MAX_LENGTH_300_CHARACTERS)
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
			throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
		}

		return value;
	}),
	body('otherNotValidReasons')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.isLength({ min: 0, max: 300 })
		.withMessage(ERROR_MAX_LENGTH_300_CHARACTERS)
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
	getAppealsValidator,
	getAppealValidator,
	getAppellantCaseValidator,
	getLPAQuestionnaireValidator,
	patchAppealValidator,
	patchAppellantCaseValidator,
	patchLPAQuestionnaireValidator
};
