import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_CANNOT_BE_EMPTY_STRING,
	ERROR_MAX_LENGTH_300_CHARACTERS,
	ERROR_MUST_BE_STRING
} from '../constants.js';
import validateIdParameter from '#common/validators/id-parameter.js';

const getAppellantValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantId'),
	validationErrorHandler
);

const patchAppellantValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantId'),
	body('name')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.notEmpty()
		.withMessage(ERROR_CANNOT_BE_EMPTY_STRING)
		.isLength({ max: 300 })
		.withMessage(ERROR_MAX_LENGTH_300_CHARACTERS),
	validationErrorHandler
);

export { getAppellantValidator, patchAppellantValidator };
