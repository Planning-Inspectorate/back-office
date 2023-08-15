import { composeMiddleware } from '@pins/express';
import { validationErrorHandler } from '#middleware/error-handler.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateStringParameter from '#common/validators/string-parameter.js';

const getAppellantValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantId'),
	validationErrorHandler
);

const patchAppellantValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantId'),
	validateStringParameter('name'),
	validationErrorHandler
);

export { getAppellantValidator, patchAppellantValidator };
