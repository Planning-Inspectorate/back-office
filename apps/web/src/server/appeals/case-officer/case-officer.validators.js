import { createValidator, handleMulterRequest } from '@pins/express';
import { body } from 'express-validator';
import { pickBy } from 'lodash-es';
import multer from 'multer';
import { memoryStorage } from '../../lib/multer.js';
import * as lpaSession from './case-officer-session.service.js';

/** @typedef {import('@pins/appeals').CaseOfficer.Questionnaire} Questionnaire */
/** @typedef {keyof import('@pins/appeals').CaseOfficer.Questionnaire} QuestionnaireKey */

export const validateDocuments = createValidator(
	multer({
		storage: memoryStorage,
		limits: {
			fileSize: 15 * 1024 ** 2
		}
	}).array('files'),
	handleMulterRequest,
	body('files').isArray({ min: 1 }).withMessage('Select a file')
);

export const validateQuestionnaireReview = createValidator(
	// validate answers that require an accomanying description
	.../** @type {QuestionnaireKey[]} */ ([
		'applicationPlansToReachDecisionMissingOrIncorrect',
		'policiesOtherRelevantPoliciesMissingOrIncorrect',
		'policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect',
		'policiesSupplementaryPlanningDocumentsMissingOrIncorrect',
		'siteConservationAreaMapAndGuidanceMissingOrIncorrect',
		'siteListedBuildingDescriptionMissingOrIncorrect',
		'thirdPartyRepresentationsMissingOrIncorrect'
	]).map((answerType) =>
		body(`${answerType}Description`)
			.if(body('answers').custom((answers) => answers.includes(answerType)))
			.trim()
			.isLength({ min: 1 })
			.withMessage('Enter what is missing or incorrect')
			.isLength({ max: 500 })
			.withMessage('Description must be 500 characters or fewer')
	),
	// validate answers that serve as a parent to nested answers
	.../** @type {QuestionnaireKey[]} */ ([
		'thirdPartyAppealNotificationMissingOrIncorrect',
		'thirdPartyApplicationNotificationMissingOrIncorrect'
	]).map((answerType) =>
		body(answerType)
			.if(body('answers').custom((answers) => answers.includes(answerType)))
			.isArray({ min: 1 })
			.withMessage('Select what is missing or incorrect')
	),
	/** @type {import('express').RequestHandler<?, ?, RequestBody>} */
	(request, _, next) => {
		/** @typedef {{ answers: Array<keyof Questionnaire> } & Record<string, ?>} RequestBody */
		const { answers = [], ...other } = request.body;
		const allAnswers = /** @type {QuestionnaireKey[]} */ ([]);
		const descriptions = /** @type {Object<QuestionnaireKey, string>} */ ({});

		for (const answerType of answers) {
			allAnswers.push(answerType);
			// append any nested answers to the main list of answers
			if (Array.isArray(other[answerType])) {
				allAnswers.push(...other[answerType]);
			}

			// push any descriptions for which an answer exists
			const descriptionKey = `${[answerType]}Description`;

			if (other[descriptionKey]) {
				descriptions[descriptionKey] = other[descriptionKey];
			}
		}
		/** Transform posted body into a {@link Questionnaire} entity */
		request.body = {
			// ignore strings from conditional descriptions that weren't used in the UI,
			...descriptions,
			...Object.fromEntries(allAnswers.map((answerType) => [answerType, true]))
		};
		next();
	}
);

export const validateQuestionnaireReviewCompletion = createValidator(
	body('reviewComplete')
		.isIn(['true', 'false'])
		.withMessage('Select an outcome for the questionnaire')
		.bail()
		.toBoolean(),
	// Where is user is submitting an outcome for an appeal with an existing
	// questionnaire, this outcome is transformed into a questionnaire entity so
	// that can be routed through the remaining review questionnaire handler as if
	// the original questionnaire had been inputted again. Effectively, marking a
	// review as complete or incomplete creates a "new" questionnaire using the
	// existing questionnaire answers...
	/** @type {import('@pins/express').RequestHandler<import('./case-officer.locals.js').AppealLocals>} */
	async (request, _, next) => {
		if (request.body.reviewComplete) {
			request.body = {};
		} else {
			const { reviewQuestionnaire } = request.locals.appeal;

			request.body = pickBy(reviewQuestionnaire, (value, key) =>
				key.includes('MissingOrIncorrect')
			);
		}
		next();
	}
);

export const validateQuestionnaireReviewConfirmation = createValidator(
	body('confirmation')
		.toBoolean()
		.custom((value, { req }) => {
			const review = lpaSession.getQuestionnaireReview(req.session, req.locals.appealId);

			if (review?.reviewQuestionnaire) {
				return Object.keys(review.reviewQuestionnaire).length === 0 ? true : value;
			}
			return false;
		})
		.withMessage('Please confirm you have completed all follow-up tasks and emails')
);

export const validateListedBuildingDescription = createValidator(
	body('listedBuildingDescription')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a description')
		.isLength({ max: 500 })
		.withMessage('Description must be 500 characters or fewer')
);
