import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	CASE_OUTCOME_ALLOWED,
	CASE_OUTCOME_DISMISSED,
	CASE_OUTCOME_SPLIT_DECISION,
	CASE_OUTCOME_INVALID,
	ERROR_MUST_BE_STRING,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_IN_PAST,
	ERROR_CASE_OUTCOME_MUST_BE_ONE_OF,
	ERROR_MUST_BE_UUID
} from '#endpoints/constants.js';

import { dateIsAfterDate } from '#utils/date-comparison.js';

const getOutcomeValidator = composeMiddleware(
	body('outcome').isString().withMessage(ERROR_MUST_BE_STRING),
	body('outcome')
		.isIn([
			CASE_OUTCOME_ALLOWED,
			CASE_OUTCOME_DISMISSED,
			CASE_OUTCOME_SPLIT_DECISION,
			CASE_OUTCOME_INVALID
		])
		.withMessage(ERROR_CASE_OUTCOME_MUST_BE_ONE_OF),
	validationErrorHandler
);

const getDateValidator = composeMiddleware(
	body('documentDate').isDate().withMessage(ERROR_MUST_BE_CORRECT_DATE_FORMAT),
	body('documentDate')
		.custom((value) => dateIsAfterDate(new Date(), new Date(value)))
		.withMessage(ERROR_MUST_BE_IN_PAST),
	validationErrorHandler
);

const getDocumentValidator = composeMiddleware(
	body('documentGuid').isUUID().withMessage(ERROR_MUST_BE_UUID),
	validationErrorHandler
);

export { getOutcomeValidator, getDateValidator, getDocumentValidator };
