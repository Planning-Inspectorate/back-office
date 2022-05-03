import { bodyForGovukDateInput, createValidator, mapMulterErrorToValidationError } from '@pins/express';
import { validateFutureDate } from '@pins/platform';
import { body } from 'express-validator';
import multer from 'multer';
import { diskStorage } from '../../lib/multer.js';

/** @typedef {import('@pins/appeals').Inspector.SiteVisitType} SiteVisitType */
/** @typedef {import('./inspector.router').AppealParams} AppealParams */

const siteVisitTimeSlots = [
	'8am to 10am',
	'9am to 11am',
	'10am to midday',
	'11am to 1pm',
	'midday to 2pm',
	'1pm to 3pm',
	'2pm to 4pm',
	'3pm to 5pm',
	'4pm to 6pm',
	'5pm to 7pm'
];

/**
 * @typedef {Object} InspectorLocals
 * @property {object} constants - Any domain constants to make available to nunjucks.
 * @property {'xl' | 'default'} containerSize - The width of the page in this domain.
 * @property {string} serviceName - The name of the service to be displayed in the page header.
 * @property {string} serviceUrl - The root url of the service.
 */

/**
 * Register the locals for templates under this domain.
 *
 * @type {import('express').RequestHandler<any, any, any, any, InspectorLocals>}
 **/
export const registerInspectorLocals = (_, response, next) => {
	response.locals.containerSize = 'xl';
	response.locals.serviceName = 'Appeal a planning decision';
	response.locals.serviceUrl = '/inspector';
	response.locals.constants = { siteVisitTimeSlots };
	next();
};

export const validateAvailableAppeals = createValidator(
	body('appealIds')
		.isArray({ min: 1 })
		.withMessage('Select a least one appeal to assign')
		.bail()
		.customSanitizer((/** @type {string[]} */ value) => value.map(Number))
);

export const validateBookSiteVisit = createValidator(
	body('siteVisitType')
		.isIn(/** @type {SiteVisitType[]} */ (['accompanied', 'unaccompanied', 'access required']))
		.withMessage('Select a type of site visit'),
	bodyForGovukDateInput('siteVisitDate')
		.isLength({ min: 1 })
		.withMessage('Enter a site visit date')
		.isDate({ format: 'YYYY-MM-DD' })
		.withMessage('Enter a valid site visit date')
		.bail()
		.custom(validateFutureDate)
		.withMessage('Site visit date must be in the future'),
	body('siteVisitTimeSlot').isIn(siteVisitTimeSlots).withMessage('Select a time slot')
);

export const validateIssueDecision = createValidator(
	multer({
		storage: diskStorage,
		limits: {
			fileSize: 15 * Math.pow(1024, 2 /* MBs*/)
		}
	}).single('decisionLetter'),
	mapMulterErrorToValidationError,
	body('outcome')
		.isIn(['allowed', 'dismissed', 'split decision'])
		.withMessage('Select a decision'),
	body('decisionLetter')
		.custom((_, { req }) => Boolean(req.file))
		.withMessage('Select a decision letter')
);
