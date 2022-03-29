import ValidationError from './validation-error.js';
import { validationResult } from 'express-validator';
import stringEmptyOrUndefined from '../utils/string-validator.js';

const validationDecisions = {
	valid: 'valid',
	invalid: 'invalid',
	incomplete: 'incomplete'
};

const incompleteWithoutReasons = function (body) {
	return (body.AppealStatus == validationDecisions.incomplete &&
		body.Reason.namesDoNotMatch !== true &&
		body.Reason.sensitiveinfo !== true &&
		body.Reason.missingApplicationForm !== true &&
		body.Reason.missingDecisionNotice !== true &&
		body.Reason.missingGroundsForAppeal !== true &&
		body.Reason.missingSupportingDocuments !== true &&
		body.Reason.inflamatoryComments !== true &&
		body.Reason.openedInError !== true &&
		body.Reason.wrongAppealType !== true &&
        stringEmptyOrUndefined(body.Reason.otherReasons)
	);
};

const invalidWithoutReasons = function (body) {
	return (body.AppealStatus == validationDecisions.invalid &&
		body.Reason.outOfTime !== true &&
		body.Reason.noRightOfappeal !== true &&
		body.Reason.notAppealable !== true &&
		body.Reason.lPADeemedInvalid !== true &&
		stringEmptyOrUndefined(body.Reason.otherReasons)
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
