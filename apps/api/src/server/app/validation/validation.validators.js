import { difference } from 'lodash-es';
import { composeMiddleware } from '@pins/express';
import { body, validationResult } from 'express-validator';
import stringEmptyOrUndefined from '../utils/string-validator.js';

export const validateAppealAttributesToChange = composeMiddleware(
	body('AppellantName')
		.optional({ nullable: true }),
	body('LocalPlanningDepartment')
		.isAlpha('en-US', { ignore: ' ' })
		.optional({ nullable: true }),
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

const invalidAppealStatus = function (appealStatus) {
	return !Object.values(validationDecisions).includes(appealStatus);
};

const allArrayElementsInArray = function (arrayToCheck, arrayToCheckAgainst) {
	return difference(arrayToCheck, arrayToCheckAgainst).length === 0;
};

const invalidWithUnexpectedReasons = function (requestBody) {
	return requestBody.AppealStatus == validationDecisions.invalid &&
		!allArrayElementsInArray(Object.keys(requestBody.Reason), [
			'outOfTime',
			'noRightOfAppeal',
			'notAppealable',
			'lPADeemedInvalid',
			'otherReasons'
		]);
};

const incompleteWithUnexpectedReasons = function (requestBody) {
	return requestBody.AppealStatus == validationDecisions.incomplete &&
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
		]);
};

const invalidWithoutReasons = function (requestBody) {
	return (requestBody.AppealStatus == validationDecisions.invalid &&
		requestBody.Reason.outOfTime !== true &&
		requestBody.Reason.noRightOfAppeal !== true &&
		requestBody.Reason.notAppealable !== true &&
		requestBody.Reason.lPADeemedInvalid !== true &&
		stringEmptyOrUndefined(requestBody.Reason.otherReasons)
	);
};

const incompleteWithoutReasons = function (requestBody) {
	return (requestBody.AppealStatus == validationDecisions.incomplete &&
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

const validWithoutDescription = function (requestBody) {
	return (requestBody.AppealStatus == validationDecisions.valid && stringEmptyOrUndefined(requestBody.descriptionOfDevelopment));
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

/**
 * Evaluate any errors collected by express validation and return a 400 status
 * with the mapped errors.
 *
 * @type {import('express').RequestHandler}
 */
function handleValidationError(request, response, next) {
	const result = validationResult(request).formatWith(({ msg }) => msg);

	if (!result.isEmpty()) {
		response.status(400).send({ errors: result.mapped() });
	} else {
		next();
	}
}
