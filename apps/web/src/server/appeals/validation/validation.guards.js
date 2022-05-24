import * as validationSession from './validation-session.service.js';

/** @typedef {import('@pins/appeals').Validation.AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('./validation.locals').AppealLocals} ReqLocals */

/**
 * A guard that ensures an appeal is in an incomplete state.
 *
 * @type {import('@pins/express').RequestHandler<ReqLocals>}
 */
export const assertIncompleteAppeal = async ({ baseUrl, locals }, res, next) => {
	if (locals.appeal.AppealStatus === 'incomplete') {
		next();
	} else {
		// In the first instance, attempt to redirect to the appeal page. If this
		// page is also unavailable, then its own guard will handle it
		res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
	}
};

/**
 * A guard that forwards requests with any completed review outcome journey.
 *
 * @type {import('@pins/express').RequestHandler<ReqLocals>}
 */
export const assertReviewOutcomeInSession = ({ baseUrl, locals, session }, res, next) => {
	if (validationSession.getReviewOutcome(session, locals.appealId)) {
		next();
	} else {
		// In the first instance, attempt to redirect to the appeal page. If this
		// page is also unavailable, then its own guard will handle it
		res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
	}
};

/**
 * A guard that forwards requests with any review outcome status.
 *
 * @type {import('@pins/express').RequestHandler<ReqLocals>}
 */
export const assertReviewOutcomeStatusInSession = ({ baseUrl, locals, session }, res, next) => {
	const sessionStatus = validationSession.getReviewOutcomeStatus(session, locals.appealId);

	if (sessionStatus) {
		next();
	} else {
		// In the first instance, attempt to redirect to the appeal page. If this
		// page is also unavailable, then its own guard will handle it
		res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
	}
};
