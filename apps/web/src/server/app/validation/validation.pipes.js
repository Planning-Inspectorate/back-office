import { createValidator, handleMulterRequest } from '@pins/express';
import { validatePostcode } from '@pins/platform';
import { body } from 'express-validator';
import multer from 'multer';
import { memoryStorage } from '../../lib/multer.js';
import * as validationSession from './validation-session.service.js';

/** @typedef {import('@pins/appeals').Validation.AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('@pins/appeals').Validation.IncompleteReasons} IncompleteReasons */
/** @typedef {import('@pins/appeals').Validation.IncompleteReasonType} IncompleteReasonType */
/** @typedef {import('@pins/appeals').Validation.InvalidReasons} InvalidReasons */
/** @typedef {import('@pins/appeals').Validation.InvalidReasonType} InvalidReasonType */

/**
 * @typedef {object} ValidationLocals
 * @property {string} serviceName - The name of the service to be displayed in the page header.
 * @property {string} serviceUrl - The root url of the service.
 */

/**
 * Expose the default template locals to nunjucks for the validation domain.
 *
 * @type {import('express').RequestHandler<any, any, any, any, ValidationLocals>}
 */
export const registerValidationLocals = (_, response, next) => {
	response.locals.serviceName = 'Appeal a planning decision';
	response.locals.serviceUrl = '/validation';
	next();
};

export const validateAppellantName = createValidator(
	body('AppellantName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter an appellant name')
		.isLength({ max: 500 })
		.withMessage('Appellant name must be 500 characters or fewer')
);

export const validateAppealSite = createValidator(
	body('AddressLine1')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the first line of the address')
		.isLength({ max: 500 })
		.withMessage('First line of the address must be 500 characters or fewer'),
	body('AddressLine2')
		.trim()
		.isLength({ max: 500 })
		.withMessage('Second line of the address must be 500 characters or fewer'),
	body('Town')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a town or city')
		.isLength({ max: 500 })
		.withMessage('Town or city must be 500 characters or fewer'),
	body('County')
		.trim()
		.isLength({ max: 500 })
		.withMessage('County must be 500 characters or fewer'),
	body('PostCode')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a postcode')
		.custom(validatePostcode)
		.withMessage('Enter a real postcode')
);

export const validateLocalPlanningDepartment = createValidator(
	body('LocalPlanningDepartment')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Select a local planning department')
		.isLength({ max: 500 })
		.withMessage('Enter a valid local planning department')
);

export const validatePlanningApplicationReference = createValidator(
	body('PlanningApplicationReference')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a planning application reference')
		.isLength({ max: 500 })
		.withMessage('Planning application reference must be 500 characters or fewer')
);

export const validateReviewOutcomeConfirmation = createValidator(
	body('confirmation')
		.custom((value, { req }) => {
			const status = validationSession.getReviewOutcomeStatus(req.session, req.params?.appealId);

			return status === 'incomplete' ? Boolean(value) : true;
		})
		.withMessage('Confirm you have completed all follow-up tasks and emails')
);

export const validateAppealDocuments = createValidator(
	multer({
		storage: memoryStorage,
		limits: {
			fileSize: 15 * 1024 ** 2
		}
	}).array('files'),
	handleMulterRequest,
	body('files').isArray({ min: 1 }).withMessage('Select a file')
);

export const validateReviewOutcomeStatus = createValidator(
	body('status')
		.isIn(['valid', 'invalid', 'incomplete'])
		.withMessage('Select an outcome for the review')
);

export const validateValidReviewOutcome = createValidator(
	body('descriptionOfDevelopment')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a description of the development')
		.isLength({ max: 500 })
		.withMessage('Decscription of development must be 500 characters or fewer')
);

/**
 * @typedef {object} UnparsedIncompleteOutcomeBody
 * @property {'incomplete'} status
 * @property {(IncompleteReasonType | 'missingDocuments')[]=} reasons
 * @property {IncompleteReasonType[]=} documentReasons
 * @property {string} otherReasons
 */

/** @typedef {import('./validation.service').IncompleteAppealData} ParsedIncompleteOutcomeBody */

const validateIncompleteOutcome = createValidator(
	body('reasons').isArray({ min: 1 }).withMessage('Choose at least one reason'),
	body('documentReasons')
		.if(body('reasons').custom((value = []) => value.includes('missingDocuments')))
		.isArray({ min: 1 })
		.withMessage('Select which documents are missing or wrong'),
	body('otherReasons')
		.if(
			body('reasons').custom((/** @type {IncompleteReasonType[]} */ reasons) =>
				reasons.includes('otherReasons')
			)
		)
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the reasons why something is missing or wrong')
		.isLength({ max: 500 })
		.withMessage('The list of reasons must be 500 characters or fewer'),
	// Transform the raw posted body generated by the form data into the schema
	// accepted by the api. This allows us to funnel the frontend data through the
	// api validators.
	/** @type {import('express').RequestHandler} */
	(request, _, next) => {
		const {
			reasons = [],
			documentReasons = [],
			otherReasons
		} = /** @type {UnparsedIncompleteOutcomeBody} */ (request.body);

		request.body = {
			status: 'incomplete',
			reasons: Object.fromEntries(
				[...documentReasons, ...reasons]
					// This 'Missing documents' reason, passed as part of the selected
					// reasons but handled earlier in the validation, is now discarded
					.filter((reasonType) => reasonType !== 'missingDocuments')
					.map((reasonType) => [reasonType, reasonType === 'otherReasons' ? otherReasons : true])
			)
		};
		next();
	}
);

/**
 * @typedef {object} UnparsedInvalidOutcomeBody
 * @property {'invalid'} status
 * @property {InvalidReasonType[]=} reasons
 * @property {string} otherReasons
 */

/** @typedef {import('./validation.service').InvalidAppealData} ParsedInvalidOutcomeBody */

const validateInvalidOutcome = createValidator(
	body('reasons').isArray({ min: 1 }).withMessage('Choose at least one reason'),
	body('otherReasons')
		.if(
			body('reasons').custom((/** @type {InvalidReasonType[]} */ reasons) =>
				reasons.includes('otherReasons')
			)
		)
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter the reasons why something is missing or wrong')
		.isLength({ max: 500 })
		.withMessage('The list of reasons must be 500 characters or fewer'),
	/** @type {import('express').RequestHandler} */
	(request, _, next) => {
		const { reasons = [], otherReasons } = /** @type {UnparsedInvalidOutcomeBody} */ (request.body);

		request.body = /** @type {ParsedInvalidOutcomeBody} */ ({
			status: 'invalid',
			reasons: Object.fromEntries(
				reasons.map((reasonType) => [
					reasonType,
					reasonType === 'otherReasons' ? otherReasons : true
				])
			)
		});
		next();
	}
);

/**
 * Interim validator that invokes the correct validator for the given review
 * outcome status.
 *
 * @type {import('express').RequestHandler<?, ?, { status: AppealOutcomeStatus }>}
 */
export const validateReviewOutcome = (request, response, next) => {
	switch (request.body.status) {
		case 'incomplete':
			validateIncompleteOutcome(request, response, next);
			break;

		case 'invalid':
			validateInvalidOutcome(request, response, next);
			break;

		case 'valid':
			validateValidReviewOutcome(request, response, next);
			break;

		default:
			next(new Error('Review outcome status could not be determined'));
	}
};
