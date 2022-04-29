import { createAsyncHandler } from '../../lib/async-error-handler.js';
import * as validationSession from './validation-session.service.js';
import * as validationService from './validation.service.js';

/** @typedef {import('@pins/appeals').Validation.AppealOutcomeStatus} AppealOutcomeStatus */
/** @typedef {import('./validation.router').AppealParams} AppealParams */
/** @typedef {import('got').RequestError} RequestError */

/**
 * A guard that ensures an appeal is in an incomplete state.
 *
 * @type {import('express').RequestHandler<AppealParams>}
 */
export const assertIncompleteAppeal = createAsyncHandler(async (request, response, next) => {
	const appeal = await validationService.findAppealById(request.params.appealId);

	if (appeal.AppealStatus === 'incomplete') {
		next();
	} else {
		// In the first instance, attempt to redirect to the appeal page. If this
		// page is also unavailable, then its own guard will handle it
		response.redirect(`/validation/appeals/${request.params.appealId}`);
	}
});

/**
 * A guard that ensures an appeal is in a state that can be reviewed, else
 * render an error page.
 *
 * @type {import('express').RequestHandler<AppealParams>}
 */
export const canReviewAppeal = async (request, response, next) => {
	try {
		await validationService.findAppealById(request.params.appealId);
		next();
	} catch (error) {
		const requestError = /** @type {RequestError} */ (error);

		if (requestError.response?.statusCode === 409) {
			response.render('validation/appeal-error', { errorMessage: 'Appeal already reviewed' });
		} else {
			next(error);
		}
	}
};

/**
 * A guard that forwards requests with any completed review outcome journey.
 *
 * @type {import('express').RequestHandler<AppealParams>}
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
 * @type {import('express').RequestHandler<AppealParams>}
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
