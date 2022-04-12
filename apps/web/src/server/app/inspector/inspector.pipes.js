import { mapMulterErrorToValidationError } from '@pins/express';
import { siteVisitTimeSlots } from '@pins/inspector';
import { validateFutureDate } from '@pins/platform';
import { checkSchema } from 'express-validator';
import multer from 'multer';
import { diskStorage } from '../../lib/multer.js';

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

export const validateSiteVisit = checkSchema({
	siteVisitType: {
		notEmpty: {
			errorMessage: 'Select a type of site visit',
			bail: true
		},
		isIn: {
			errorMessage: 'Select a valid type',
			options: [['accompanied', 'unaccompanied', 'access required']]
		}
	},
	siteVisitDate: {
		notEmpty: {
			errorMessage: 'Enter date for site visit',
			bail: true
		},
		isDate: {
			errorMessage: 'Enter a valid date',
			bail: true,
			options: {
				format: 'DD-MM-YYYY'
			}
		},
		custom: {
			options: validateFutureDate,
			errorMessage: 'Enter correct date for site visit'
		}
	},
	siteVisitTimeSlot: {
		notEmpty: {
			errorMessage: 'Enter time slot for site visit',
			bail: true
		},
		isIn: {
			errorMessage: 'Select a valid time slot',
			options: siteVisitTimeSlots
		}
	}
});
