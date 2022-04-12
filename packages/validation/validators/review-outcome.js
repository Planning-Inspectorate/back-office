// @ts-check

import { composeMiddleware, createValidator, createWhitelistedKeysValidator } from '@pins/express';
import { body } from 'express-validator';
import { has } from 'lodash-es';

/** @typedef {import('../index').AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('../index').IncompleteReasonType} IncompleteReasonType */
/** @typedef {import('../index').InvalidReasonType} InvalidReasonType */

/**
 * Validate a {@link {import('express').Request}} body for a valid review status.
 */
export const validateReviewOutcomeStatus = createValidator(
	body('status').isIn(['valid', 'invalid', 'incomplete']).withMessage('Choose an outcome for the appeal')
);

/**
 * Validate a {@link {import('express').Request}} body for a review outcome.
 */
export const validateReviewOutcome = [
	validateReviewOutcomeStatus,
	/** @type {import('express').RequestHandler<{}, {}, { status: AppealOutcomeStatus }>} */
	async (req, res, next) => {
		switch (req.body.status) {
			case 'incomplete':
				validateIncompleteReviewOutcome(req, res, next);
				break;

			case 'invalid':
				validateInvalidReviewOutcome(req, res, next);
				break;

			case 'valid':
				validateValidReviewOutcome(req, res, next);
				break;
		}
		next();
	}
];

/**
 * @readonly
 * @type {IncompleteReasonType[]}
 */
const incompleteReasonTypes = [
	'inflammatoryComments',
	'missingApplicationForm',
	'missingDecisionNotice',
	'missingGroundsForAppeal',
	'missingSupportingDocuments',
	'namesDoNotMatch',
	'openedInError',
	'otherReasons',
	'sensitiveInfo',
	'wrongAppealTypeUsed'
];

/**
 * Validate a {@link {import('express').Request}} body for an incomplete review outcome.
 */
export const validateIncompleteReviewOutcome = composeMiddleware(
	body('status').equals('incomplete'),
	body('reasons')
		.isObject()
		.withMessage('`reasons` is not a valid object')
		.bail()
		.custom(
			createWhitelistedKeysValidator({
				whitelist: incompleteReasonTypes,
				errorMessage: "Unknown key. '{{ key }}' is not a valid reason type."
			})
		)
		.custom((reasons) => incompleteReasonTypes.some((incompleteReasonType) => reasons[incompleteReasonType] === true) || has(reasons, 'otherReasons'))
		.withMessage('Choose at least one reason'),
	body('reasons.otherReasons')
		.optional({ nullable: true })
		.isString()
		.withMessage('`reasons.otherReasons` is not a valid string')
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the reasons why something is missing or wrong')
		.isLength({ max: 500 })
		.withMessage('The list of reasons must be 500 characters or fewer')
);

/**
 * @readonly
 * @type {InvalidReasonType[]}
 */
const invalidReasonTypes = ['outOfTime', 'noRightOfAppeal', 'notAppealable', 'lPADeemedInvalid', 'otherReasons'];

/**
 * Validate a {@link {import('express').Request}} body for an invalid review outcome.
 */
export const validateInvalidReviewOutcome = createValidator(
	body('status').equals('invalid'),
	body('reasons')
		.isObject()
		.withMessage('`reasons` is not a valid object.')
		.bail()
		.custom(
			createWhitelistedKeysValidator({
				whitelist: invalidReasonTypes,
				errorMessage: "Unknown key. '{{ key }}' is not a valid reason type."
			})
		)
		.custom((reasons) => invalidReasonTypes.some((invalidReasonType) => reasons[invalidReasonType] === true) || has(reasons, 'otherReasons'))
		.withMessage('Choose at least one reason'),
	body('reasons.otherReasons')
		.optional({ nullable: true })
		.isString()
		.withMessage('`reasons.otherReasons` is not a valid string')
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the reasons')
		.isLength({ max: 500 })
		.withMessage('The list of reasons must be 500 characters or fewer')
);

/**
 * Validate a {@link {import('express').Request}} body for a valid review outcome.
 */
export const validateValidReviewOutcome = createValidator(
	body('status').equals('valid'),
	body('descriptionOfDevelopment')
		.isString()
		.withMessage('Missing `descriptionOfDevelopment` of type string')
		.bail()
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a description of the development')
		.isLength({ max: 500 })
		.withMessage('Decscription of development must be 500 characters or fewer')
);
