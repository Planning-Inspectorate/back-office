import { composeMiddleware } from '@pins/express';
import { validationErrorHandler } from '#middleware/error-handler.js';
import validateIdParameter from '#common/validators/id-parameter.js';

const getAuditTrailValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validationErrorHandler
);

export { getAuditTrailValidator };
