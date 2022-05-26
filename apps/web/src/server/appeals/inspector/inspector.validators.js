import { bodyForGovukDateInput, createValidator, handleMulterRequest } from '@pins/express';
import { validateFutureDate } from '@pins/platform';
import { body } from 'express-validator';
import multer from 'multer';
import { diskStorage } from '../../lib/multer.js';

export const siteVisitTimeSlots = [
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

export const validateAvailableAppeals = createValidator(
	body('appealIds')
		.isArray({ min: 1 })
		.withMessage('Select a least one appeal to assign')
		.bail()
		.customSanitizer((/** @type {string[]} */ value) => value.map(Number))
);

export const validateBookSiteVisit = createValidator(
	body('siteVisitType')
		.isIn(
			/** @type {import('@pins/appeals').Inspector.SiteVisitType[]} */ ([
				'accompanied',
				'unaccompanied',
				'access required'
			])
		)
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
			fileSize: 15 * 1024 ** 2
		}
	}).single('decisionLetter'),
	handleMulterRequest,
	body('outcome').isIn(['allowed', 'dismissed', 'split decision']).withMessage('Select a decision'),
	body('decisionLetter').exists().withMessage('Select a decision letter')
);
