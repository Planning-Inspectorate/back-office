import { body, param } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import { composeMiddleware } from '@pins/express';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateTimeParameter from '#common/validators/time-parameter.js';
import validateTimeRangeParameters from '#common/validators/time-range-parameters.js';
import {
	ERROR_INVALID_SITE_VISIT_TYPE,
	ERROR_SITE_VISIT_REQUIRED_FIELDS,
	SITE_VISIT_TYPE_UNACCOMPANIED
} from '#endpoints/constants.js';
import checkStringsMatch from '#utils/check-strings-match.js';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */

/**
 * @param {string} visitType
 * @returns {boolean}
 */
const isVisitUnaccompanied = (visitType) =>
	checkStringsMatch(visitType, SITE_VISIT_TYPE_UNACCOMPANIED);

/**
 * @param {boolean} isRequired
 * @returns {ValidationChain}
 */
const validateSiteVisitType = (isRequired = false) => {
	const validator = body('visitType');

	if (!isRequired) {
		validator.optional();
	}

	validator.isString().withMessage(ERROR_INVALID_SITE_VISIT_TYPE);

	return validator;
};

const validateSiteVisitRequiredDateTimeFields = param('appealId').custom((value, { req }) => {
	const { visitDate, visitEndTime, visitStartTime, visitType } = req.body;

	if (!isVisitUnaccompanied(visitType)) {
		if (visitDate || visitStartTime || visitEndTime) {
			if (!visitDate || !visitStartTime || !visitEndTime) {
				throw new Error(ERROR_SITE_VISIT_REQUIRED_FIELDS);
			}
		}
	}

	return value;
});

const getSiteVisitValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('siteVisitId'),
	validationErrorHandler
);

const postSiteVisitValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateSiteVisitRequiredDateTimeFields,
	validateSiteVisitType(true),
	validateDateParameter({ parameterName: 'visitDate' }),
	validateTimeParameter('visitStartTime'),
	validateTimeParameter('visitEndTime'),
	validateTimeRangeParameters('visitStartTime', 'visitEndTime'),
	validationErrorHandler
);

const patchSiteVisitValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('siteVisitId'),
	validateSiteVisitRequiredDateTimeFields,
	validateSiteVisitType(),
	validateDateParameter({ parameterName: 'visitDate' }),
	body('visitStartTime')
		.if(body('visitType').not().equals(SITE_VISIT_TYPE_UNACCOMPANIED))
		.custom((value, { req }) => {
			if (value) {
				return validateTimeParameter('visitStartTime')(req, {}, () => {});
			}
			return true;
		}),
	body('visitEndTime')
		.if(body('visitType').not().equals(SITE_VISIT_TYPE_UNACCOMPANIED))
		.custom((value, { req }) => {
			if (value) {
				return validateTimeParameter('visitEndTime')(req, {}, () => {});
			}
			return true;
		}),
	body(['visitStartTime', 'visitEndTime'])
		.if(body('visitType').not().equals(SITE_VISIT_TYPE_UNACCOMPANIED))
		.custom((value, { req }) => {
			if (req.body.visitStartTime && req.body.visitEndTime) {
				return validateTimeRangeParameters('visitStartTime', 'visitEndTime')(req, {}, () => {});
			}
			return true;
		}),
	validationErrorHandler
);

export { getSiteVisitValidator, patchSiteVisitValidator, postSiteVisitValidator };
