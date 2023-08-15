import { composeMiddleware } from '@pins/express';
import { validationErrorHandler } from '#middleware/error-handler.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateStringParameter from '#common/validators/string-parameter.js';
import { MAX_LENGTH_8 } from '#endpoints/constants.js';

const getAddressValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('addressId'),
	validationErrorHandler
);

const patchAddressValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('addressId'),
	validateStringParameter('addressLine1'),
	validateStringParameter('addressLine2'),
	validateStringParameter('country'),
	validateStringParameter('county'),
	validateStringParameter('postcode', MAX_LENGTH_8),
	validateStringParameter('town'),
	validationErrorHandler
);

export { getAddressValidator, patchAddressValidator };
