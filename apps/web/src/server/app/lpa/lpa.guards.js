import { getReviewQuestionnaireDocumentTypeRequired } from '@pins/appeals';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
import * as lpaSession from './lpa-session.service.js';
import * as lpaService from './lpa.service.js';

/** @typedef {import('@pins/appeals').DocumentType} DocumentType */
/** @typedef {import('./lpa.router').AppealParams} AppealParams */
/** @typedef {import('./lpa.router').AppealDocumentParams} AppealDocumentParams */

/**
 * Guard that protects routes from having further documents of a certain type
 * added to an appeal when they are not recognised as missing or incorrect by
 * the reviewed questionnaire.
 *
 * @type {import('express').RequestHandler<AppealDocumentParams>}
 */
export const assertDocumentTypeMissingOrIncorrect = createAsyncHandler(async (request, response, next) => {
	const { appealId, documentType } = request.params;
	const { reviewQuestionnaire } = await lpaService.findAppealById(appealId);

	if (reviewQuestionnaire && getReviewQuestionnaireDocumentTypeRequired(reviewQuestionnaire, documentType)) {
		next();
	} else {
		response.redirect(`/lpa/appeals/${appealId}`);
	}
});

/**
 * Guard that ensures that an appeal is still accepting final comments as part
 * of a full planning appeal.
 *
 * @type {import('express').RequestHandler<AppealParams>}
 */
export const assertFinalCommentsRequired = createAsyncHandler(async ({ params }, response, next) => {
	const appeal = await lpaService.findFullPlanningAppealById(params.appealId);

	if (appeal.acceptingFinalComments) {
		next();
	} else {
		response.redirect('/lpa');
	}
});

/**
 * Guard that ensures that the requested appeal has an incomplete questionnaire.
 * 
 * @type {import('express').RequestHandler<AppealDocumentParams>}
 */
export const assertIncompleteQuestionnaire = createAsyncHandler(
	async ({ params }, response, next) => {
		const { reviewQuestionnaire } = await lpaService.findAppealById(params.appealId);

		if (reviewQuestionnaire && !reviewQuestionnaire.complete) {
			next();
		} else {
			response.redirect(`/lpa/appeals/${params.appealId}`);
		}
	}
);

/**
 * Guard that ensures that a listed building description can be updated due to
 * it having been marked as missing or incorrect when completing the
 * questionnaire review.
 * 
 * @type {import('express').RequestHandler<AppealDocumentParams>}
 */
export const assertListedBuildingDescriptionMissingOrIncorrect = createAsyncHandler(
	async ({ params }, response, next) => {
		const { reviewQuestionnaire } = await lpaService.findAppealById(params.appealId);

		if (reviewQuestionnaire && reviewQuestionnaire.siteListedBuildingDescriptionMissingOrIncorrect) {
			next();
		} else {
			response.redirect(`/lpa/appeals/${params.appealId}`);
		}
	}
);

/**
 * Guard that ensures that an appeal is still accepting statements as part of a
 * full planning appeal.
 *
 * @type {import('express').RequestHandler<AppealParams>}
 */
export const assertStatementsRequired = createAsyncHandler(async ({ params }, response, next) => {
	const appeal = await lpaService.findFullPlanningAppealById(params.appealId);

	if (appeal.acceptingStatements) {
		next();
	} else {
		response.redirect('/lpa');
	}
});

/**
 * Guard that ensures that a reviewed questionnaire exists within the session.
 * This is used to determine that later stages of the review journey can be
 * accessed.
 *
 * @type {import('express').RequestHandler<AppealParams>}
 */
export const assertQuestionnaireReviewExists = ({ params, session }, response, next) => {
	const reviewQuestionnaire = lpaSession.getQuestionnaireReview(session, params.appealId);

	if (reviewQuestionnaire) {
		next();
	} else {
		response.redirect(`/lpa/appeals/${params.appealId}`);
	}
};
