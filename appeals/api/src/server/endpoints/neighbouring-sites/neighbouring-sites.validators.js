import { composeMiddleware } from '@pins/express';
import { validationErrorHandler } from '#middleware/error-handler.js';
import validateStringParameter, {
	validateRequiredStringParameter
} from '#common/validators/string-parameter.js';
import validateRegex from '#common/validators/regex-parameter.js';
import validateNumberParameter, {
	validateRequiredNumberParameter
} from '#common/validators/number-parameter.js';
import { ERROR_INVALID_POSTCODE } from '#endpoints/constants.js';

const regexUkPostcode =
	'^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$';

const createNeighbouringSiteValidator = composeMiddleware(
	validateRequiredStringParameter('postcode'),
	validateRequiredStringParameter('addressLine1'),
	validateRequiredStringParameter('town'),
	validateStringParameter('addressLine2'),
	validateStringParameter('country'),
	validateStringParameter('county'),
	validateRegex('postcode', regexUkPostcode),
	validationErrorHandler
);

const updateNeighbouringSiteValidator = composeMiddleware(
	validateRequiredNumberParameter('siteId'),
	validateRequiredStringParameter('address.postcode'),
	validateRequiredStringParameter('address.addressLine1'),
	validateRequiredStringParameter('address.town'),
	validateStringParameter('address.addressLine2'),
	validateStringParameter('address.county'),
	validateRegex('address.postcode', regexUkPostcode).withMessage(ERROR_INVALID_POSTCODE),
	validationErrorHandler
);

const deleteNeighbouringSiteValidator = composeMiddleware(
	validateNumberParameter('siteId'),
	validationErrorHandler
);

export {
	createNeighbouringSiteValidator,
	updateNeighbouringSiteValidator,
	deleteNeighbouringSiteValidator
};
