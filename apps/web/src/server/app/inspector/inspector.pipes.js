import { createValidator, mapMulterErrorToValidationError } from '@pins/express';
import { siteVisitTimeSlots } from '@pins/inspector';
import { validateFutureDate } from '@pins/platform';
import { body, checkSchema } from 'express-validator';
import multer from 'multer';
import { diskStorage } from '../../lib/multer.js';

/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */

/**
 * Register the locals for templates under this domain.
 *
 * @type {import('express').RequestHandler}
 */
export const registerInspectorLocals = (_, response, next) => {
	response.locals.constants = { siteVisitTimeSlots };
	response.locals.containerSize = 'xl';
	response.locals.serviceName = 'Appeal a householder planning decision';
	response.locals.serviceUrl = '/inspector';
	next();
};

export const validateBookSiteVisit = createValidator(
	body('siteVisitType')
		.isIn(/** @type {SiteVisitType[]} */ ([
			'accompanied',
			'unaccompanied',
			'access required'
		]))
		.withMessage('Select a type of site visit'),
	body('siteVisitDate')
		.isDate({ format: 'DD-MM-YYYY' })
		.withMessage('Enter a site visit date')
		.bail()
		.custom(validateFutureDate)
		.withMessage('Site visit date must be in the future'),
	body('siteVisitTimeSlot')
		.isIn(siteVisitTimeSlots)
		.withMessage('Select a time slot')
);

export const handleDecision = [
	multer({
		storage: diskStorage,
		limits: {
			fileSize: 15 * Math.pow(1024, 2 /* MBs*/)
		}
	}).single('decisionLetter'),
	mapMulterErrorToValidationError,
	checkSchema({
		outcome: {
			notEmpty: {
				errorMessage: 'Select a decision',
				bail: true
			},
			isIn: {
				errorMessage: 'Select a valid decision',
				options: [['allowed', 'dismissed', 'split decision']]
			}
		},
		decisionLetter: {
			custom: {
				options: (_, { req }) => Boolean(req.file),
				errorMessage: 'Select a decision letter'
			}
		}
	})
];

export const validateAvailableAppeals = checkSchema({
	appealIds: {
		isArray: {
			errorMessage: 'Select a least one appeal to assign',
			options: { min: 1 },
			bail: true
		},
		customSanitizer: {
			options: (/** @type {string[]} */ value) => value.map(Number)
		}
	}
});
