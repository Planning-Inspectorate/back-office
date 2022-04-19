// @ts-check

import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { validateFutureDate } from '@pins/platform';
import multer from 'multer';
import { body, header, validationResult } from 'express-validator';
import appealRepository from '../repositories/appeal.repository.js';

/** @typedef {import('@pins/appeals').Inspector.SiteVisitType} SiteVisitType */
/** @typedef {keyof typeof import('../state-machine/inspector-states').inspectorStates} InspectorState } */

/** @type {import('express').RequestHandler } */
export const validateUserId = async (request, response, next) => {
	const result = await header('userId').notEmpty().bail().withMessage('Authentication error. Missing header `userId`.').toInt().run(request);

	if (!result.isEmpty()) {
		response.status(401).send({ errors: result.formatWith(({ msg }) => msg).mapped() });
	} else {
		next();
	}
};

export const validateUserBelongsToAppeal = composeMiddleware(validateUserId, async (request, response, next) => {
	const result = await header('userId')
		.custom(async (/** @type {number} */ userId, { req }) => {
			const appeal = await appealRepository.getById(req.params.appealId);

			if (appeal.userId === userId) {
				return true;
			}
			throw new Error('User is not permitted to perform this action.');
		})
		.run(request);

	if (!result.isEmpty()) {
		response.status(403).send({ errors: result.formatWith(({ msg }) => msg).mapped() });
	} else {
		next();
	}
});

export const validateBookSiteVisit = composeMiddleware(
	body('siteVisitType')
		.isIn(/** @type {SiteVisitType[]} */ (['accompanied', 'unaccompanied', 'access required']))
		.withMessage('Select a type of site visit'),
	body('siteVisitDate')
		.isDate({ format: 'YYYY-MM-DD' })
		.withMessage('Enter a site visit date')
		.bail()
		.toDate()
		.custom(validateFutureDate)
		.withMessage('Site visit date must be in the future'),
	body('siteVisitTimeSlot')
		.isIn([
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
		])
		.withMessage('Select a valid time slot'),
	handleValidationError
);

// TODO: are there any validation rules on this decision letter upload? Added
// size limit for now.
export const validateIssueDecision = composeMiddleware(
	multer({
		// TODO: store this file in memory as it's just passing through
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 15 * Math.pow(1024, 2 /* MBs*/)
		}
	}).single('decisionLetter'),
	mapMulterErrorToValidationError,
	body('outcome').isIn(['allowed', 'dismissed', 'split decision']).withMessage('Select a valid decision'),
	body('decisionLetter')
		.custom((_, { req }) => Boolean(req.file))
		.withMessage('Select a decision letter'),
	handleValidationError
);

export const validateAssignAppealsToInspector = composeMiddleware(
	body().isArray().withMessage('Provide appeals to assign to the inspector'),
	handleValidationError
);

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
