// @ts-check

import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { difference } from 'lodash-es';
import { handleValidationError } from '../../middleware/handle-validation-error.js';
import { validateAppealStatus } from '../../middleware/validate-appeal-status.js';
import stringEmptyOrUndefined from '../../utils/string-validator.js';

export const validateAppealBelongsToValidation = validateAppealStatus([
	'received_appeal',
	'awaiting_validation_info'
]);

export const validateAppealAttributesToChange = composeMiddleware(
	body('AppellantName').trim().optional({ nullable: true }),
	body('LocalPlanningDepartment').trim().optional({ nullable: true }),
	body('PlanningApplicationReference').optional({ nullable: true }),
	body('Address.AddressLine1').optional({ nullable: true }),
	body('Address.AddressLine2').optional({ nullable: true }),
	body('Address.County').optional({ nullable: true }),
	body('Address.Town').optional({ nullable: true }),
	body('Address.PostCode').optional({ nullable: true }),
	handleValidationError
);

const validationDecisions = {
	valid: 'valid',
	invalid: 'invalid',
	incomplete: 'incomplete'
};

const invalidAppealStatus = (appealStatus) => {
	return !Object.values(validationDecisions).includes(appealStatus);
};

const allArrayElementsInArray = (arrayToCheck, arrayToCheckAgainst) => {
	return difference(arrayToCheck, arrayToCheckAgainst).length === 0;
};

const invalidWithUnexpectedReasons = (requestBody) => {
	return (
		requestBody.AppealStatus === validationDecisions.invalid &&
		!allArrayElementsInArray(Object.keys(requestBody.Reason), [
			'outOfTime',
			'noRightOfAppeal',
			'notAppealable',
			'lPADeemedInvalid',
			'otherReasons'
		])
	);
};

const incompleteWithUnexpectedReasons = (requestBody) => {
	return (
		requestBody.AppealStatus === validationDecisions.incomplete &&
		!allArrayElementsInArray(Object.keys(requestBody.Reason), [
			'namesDoNotMatch',
			'sensitiveInfo',
			'missingApplicationForm',
			'missingDecisionNotice',
			'missingGroundsForAppeal',
			'missingSupportingDocuments',
			'inflammatoryComments',
			'openedInError',
			'wrongAppealTypeUsed',
			'otherReasons'
		])
	);
};

const invalidWithoutReasons = (requestBody) => {
	return (
		requestBody.AppealStatus === validationDecisions.invalid &&
		requestBody.Reason.outOfTime !== true &&
		requestBody.Reason.noRightOfAppeal !== true &&
		requestBody.Reason.notAppealable !== true &&
		requestBody.Reason.lPADeemedInvalid !== true &&
		stringEmptyOrUndefined(requestBody.Reason.otherReasons)
	);
};

const incompleteWithoutReasons = (requestBody) => {
	return (
		requestBody.AppealStatus === validationDecisions.incomplete &&
		requestBody.Reason.namesDoNotMatch !== true &&
		requestBody.Reason.sensitiveInfo !== true &&
		requestBody.Reason.missingApplicationForm !== true &&
		requestBody.Reason.missingDecisionNotice !== true &&
		requestBody.Reason.missingGroundsForAppeal !== true &&
		requestBody.Reason.missingSupportingDocuments !== true &&
		requestBody.Reason.inflammatoryComments !== true &&
		requestBody.Reason.openedInError !== true &&
		requestBody.Reason.wrongAppealTypeUsed !== true &&
		stringEmptyOrUndefined(requestBody.Reason.otherReasons)
	);
};

const validWithoutDescription = (requestBody) => {
	return (
		requestBody.AppealStatus === validationDecisions.valid &&
		stringEmptyOrUndefined(requestBody.descriptionOfDevelopment)
	);
};

export const validateAppealValidationDecision = (request, response, next) => {
	if (
		invalidAppealStatus(request.body.AppealStatus) ||
		invalidWithUnexpectedReasons(request.body) ||
		invalidWithoutReasons(request.body) ||
		incompleteWithUnexpectedReasons(request.body) ||
		incompleteWithoutReasons(request.body) ||
		validWithoutDescription(request.body)
	) {
		response.status(409).send({
			errors: {
				status: 'Invalid validation decision provided'
			}
		});
	} else {
		next();
	}
};
