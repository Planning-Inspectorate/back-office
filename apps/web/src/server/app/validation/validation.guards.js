import * as validationSession from './validation-session.service.js';

/** @typedef {import('@pins/validation').AppealOutcomeStatus} AppealOutcomeStatus */

/**
 * A guard that forwards requests with any completed review outcome journey.
 *
 * @type {import('express').RequestHandler<any>}
 */
export const hasReviewOutcome = ({ params, session }, response, next) => {
	if (validationSession.getReviewOutcome(session, params.appealId)) {
		next();
	} else {
		// In the first instance, attempt to redirect to the appeal page. If this
		// page is also unavailable, then its own guard will handle it
		response.redirect(`/validation/appeals/${params.appealId}`);
	}
};

/**
 * A guard that forwards requests with any review outcome status.
 *
 * @type {import('express').RequestHandler<any>}
 */
 export const hasReviewOutcomeStatus = ({ params, session }, response, next) => {
	const sessionStatus = validationSession.getReviewOutcomeStatus(session, params.appealId);

	if (sessionStatus) {
		next();
	} else {
		// In the first instance, attempt to redirect to the appeal page. If this
		// page is also unavailable, then its own guard will handle it
		response.redirect(`/validation/appeals/${params.appealId}`);
	}
};
