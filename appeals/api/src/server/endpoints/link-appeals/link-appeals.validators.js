import { composeMiddleware } from '@pins/express';
import { validationErrorHandler } from '#middleware/error-handler.js';
import { ERROR_MUST_BE_NUMBER } from '#endpoints/constants.js';
import validateStringParameter from '#common/validators/string-parameter.js';
import { body } from 'express-validator';

const postLinkAppealValidator = composeMiddleware(
	body('linkedAppealId').isInt().withMessage(ERROR_MUST_BE_NUMBER),
	validationErrorHandler
);

const postLinkLegacyAppealValidator = composeMiddleware(
	validateStringParameter('linkedAppealReference'),
	validationErrorHandler
);

const unlinkAppealValidator = composeMiddleware(
	validateStringParameter('linkedAppealReference'),
	validationErrorHandler
);

export { postLinkAppealValidator, postLinkLegacyAppealValidator, unlinkAppealValidator };
