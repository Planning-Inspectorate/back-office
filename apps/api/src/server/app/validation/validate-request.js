import _ from 'lodash';
import { validationResult } from 'express-validator';
import ValidationError from './validation-error.js';
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

const allArrayElementsInArray = function(arrayToCheck, arrayToCheckAgainst) {
	return _.difference(arrayToCheck, arrayToCheckAgainst).length === 0;
};

const invalidWithoutReasons = function(body) {
	return (body.AppealStatus == validationDecisions.invalid &&
		body.Reason.outOfTime !== true &&
		body.Reason.noRightOfAppeal !== true &&
		body.Reason.notAppealable !== true &&
		body.Reason.lPADeemedInvalid !== true &&
		stringEmptyOrUndefined(body.Reason.otherReasons)
	);
};

const invalidWithUnexpectedReasons = function(body) {
	return body.AppealStatus == validationDecisions.invalid &&
		!allArrayElementsInArray(Object.keys(body.Reason), [
			'outOfTime',
			'noRightOfAppeal',
			'notAppealable',
			'lPADeemedInvalid',
			'otherReasons'
		]);
};

const incompleteWithUnexpectedReasons = function (body) {
	return body.AppealStatus == validationDecisions.incomplete &&
		!allArrayElementsInArray(Object.keys(body.Reason), [
			'namesDoNotMatch',
			'sensitiveinfo',
			'missingApplicationForm',
			'missingDecisionNotice',
			'missingGroundsForAppeal',
			'missingSupportingDocuments',
			'inflamatoryComments',
			'openedInError',
			'wrongAppealType',
			'otherReasons'
		]);
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
	if (invalidWithUnexpectedReasons(body) || incompleteWithUnexpectedReasons(body)) {
		throw new ValidationError('Unknown Reason provided', 400);
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
	if (!Object.keys(request.body).every((key) => ['AppellantName', 'LocalPlanningDepartment', 'PlanningApplicationReference', 'Address'].includes(key))) {
		throw new ValidationError('Invalid request keys', 400);
	}
	if (request.body.Address && 
		(_.isEmpty(request.body.Address) ||
		!Object.keys(request.body.Address).every((key) => ['AddressLine1', 'AddressLine2', 'County', 'Town', 'PostCode'].includes(key)))) {
		throw new ValidationError('Invalid Address in body', 400);
	}
};

export { validationDecisions, validateAppealValidatedRequest, validateUpdateValidationRequest };
