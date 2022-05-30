import { getReviewQuestionnaireDocumentTypeRequired } from './case-officer.filters.js';
import * as lpaSession from './case-officer-session.service.js';

/** @typedef {import('./case-officer.locals').AppealLocals} AppealLocals */
/** @typedef {import('./case-officer.locals').AppealDocumentLocals} AppealDocumentLocals */

/**
 * Guard that protects routes from having further documents of a certain type
 * added to an appeal when they are not recognised as missing or incorrect by
 * the reviewed questionnaire.
 *
 * @type {import('express').RequestHandler<AppealLocals & AppealDocumentLocals>}
 */
export const assertDocumentTypeMissingOrIncorrect = async ({ baseUrl, locals }, res, next) => {
	const { appeal, appealId, documentType } = locals;

	if (
		appeal.reviewQuestionnaire &&
		getReviewQuestionnaireDocumentTypeRequired(appeal.reviewQuestionnaire, documentType)
	) {
		next();
	} else {
		res.redirect(`${baseUrl}/appeals/${appealId}`);
	}
};

/**
 * Guard that ensures that an appeal is still accepting final comments as part
 * of a full planning appeal.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export const assertFinalCommentsRequired = async ({ baseUrl, locals }, res, next) => {
	if (locals.appeal.acceptingFinalComments) {
		next();
	} else {
		res.redirect(baseUrl);
	}
};

/**
 * Guard that ensures that the requested appeal has an incomplete questionnaire.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export const assertIncompleteQuestionnaire = async ({ baseUrl, locals }, res, next) => {
	const { reviewQuestionnaire } = locals.appeal;

	if (reviewQuestionnaire && !reviewQuestionnaire.complete) {
		next();
	} else {
		res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
	}
};

/**
 * Guard that ensures that a listed building description can be updated due to
 * it having been marked as missing or incorrect when completing the
 * questionnaire review.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export const assertListedBuildingDescriptionMissingOrIncorrect = async (
	{ baseUrl, locals },
	res,
	next
) => {
	const { reviewQuestionnaire } = locals.appeal;

	if (reviewQuestionnaire && reviewQuestionnaire.siteListedBuildingDescriptionMissingOrIncorrect) {
		next();
	} else {
		res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
	}
};

/**
 * Guard that ensures that an appeal is still accepting statements as part of a
 * full planning appeal.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export const assertStatementsRequired = async ({ baseUrl, locals }, res, next) => {
	if (locals.appeal.acceptingStatements) {
		next();
	} else {
		res.redirect(baseUrl);
	}
};

/**
 * Guard that ensures that a reviewed questionnaire exists within the session.
 * This is used to determine that later stages of the review journey can be
 * accessed.
 *
 * @type {import('@pins/express').RequestHandler<AppealLocals>}
 */
export const assertQuestionnaireReviewExists = ({ baseUrl, locals, session }, res, next) => {
	const reviewQuestionnaire = lpaSession.getQuestionnaireReview(session, locals.appealId);

	if (reviewQuestionnaire) {
		next();
	} else {
		res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
	}
};
