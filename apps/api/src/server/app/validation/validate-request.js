import ValidationError from './validation-error.js';
import { validationResult } from 'express-validator';
import stringEmptyOrUndefined from '../utils/string-validator.js';

const validationDecisions = {
	valid: 'valid',
	invalid: 'invalid',
	infoMissing: 'info missing'
};

const invalidWithoutReasons = function (body) {
	return (body.AppealStatus == validationDecisions.invalid &&
		body.Reason.NamesDoNotMatch !== true &&
		body.Reason.Sensitiveinfo !== true &&
		body.Reason.MissingOrWrongDocs !== true &&
		body.Reason.InflamatoryComments !== true &&
		body.Reason.OpenedInError !== true &&
		body.Reason.WrongAppealType !== true &&
        stringEmptyOrUndefined(body.Reason.OtherReasons)
	);
};

const incompleteWithoutReasons = function (body) {
	return (body.AppealStatus == validationDecisions.infoMissing &&
		body.Reason.OutOfTime !== true &&
		body.Reason.NoRightOfappeal !== true &&
		body.Reason.NotAppealable !== true &&
		body.Reason.LPADeemedInvalid !== true &&
		stringEmptyOrUndefined(body.Reason.OtherReasons)
	);
};

const invalidAppealStatus = function(appealStatus) {
	return !Object.values(validationDecisions).includes(appealStatus);
};

const validWithoutDescription = function(body) {
	return (body.AppealStatus == validationDecisions.valid && stringEmptyOrUndefined(body.DescriptionOfDevelopment));
};

const validateAppealValidatedRequest = function(body) {
	if (invalidAppealStatus(body.AppealStatus)) {
		throw new ValidationError('Unknown AppealStatus provided', 400);
	}
	if (invalidWithoutReasons(body)) {
		throw new ValidationError('Invalid Appeal requires a reason', 400);
	}
	if (incompleteWithoutReasons(body)) {
		throw new ValidationError('Incomplete Appeal requires a reason', 400);
	}
	if (validWithoutDescription(body)) {
		throw new ValidationError('Valid Appeals require Description of Development', 400);
	}
};

const validateUpdateValidationRequest = function(request) {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		throw new ValidationError('Invalid request', 400);
	}
};

export { validationDecisions, validateAppealValidatedRequest, validateUpdateValidationRequest };
