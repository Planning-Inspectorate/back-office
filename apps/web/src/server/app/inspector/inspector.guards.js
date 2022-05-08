import { composeMiddleware } from '@pins/express';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
import * as inspectorService from './inspector.service.js';
import * as inspectorSession from './inspector-session.service.js';

/** @typedef {import('@pins/appeals').Inspector.AppealStatus} AppealStatus */
/** @typedef {import('./inspector.router').AppealParams} AppealParams */

/** @type {import('express').RequestHandler<AppealParams>} */
export function assertSiteVisitInSession({ params, session }, response, next) {
	// if no site visit exists within the session, redirect to inspector root
	if (inspectorSession.getSiteVisit(session, params.appealId)) {
		next();
	} else {
		response.redirect('/inspector');
	}
}

/** @type {import('express').RequestHandler<AppealParams>} */
export function assertDecisionInSession({ params, session }, response, next) {
	// if no decision exists within the session, redirect to inspector root
	if (inspectorSession.getDecision(session, params.appealId)) {
		next();
	} else {
		response.redirect('/inspector');
	}
}

export const assertCanBookSiteVisit = composeMiddleware(
	createAppealStateGuard('not yet booked'),
	/** @type {import('express').RequestHandler<AppealParams>} - A guard scoped to the provided statuses. */
	async ({ params }, response, next) => {
		const appeal = await inspectorService.findAppealById(params.appealId);

		if (appeal.availableForSiteVisitBooking) {
			next();
		} else {
			// In the first instance, attempt to redirect to the appeal page. If this
			// page is also unavailable, then its own guard will handle it
			response.redirect(`/inspector/appeals/${params.appealId}`);
		}
	}
);

export const assertCanIssueDecision = createAppealStateGuard('decision due');

/**
 * Create a guard that ensures a requested appeal is in one of the expected states.
 *
 * @param {AppealStatus | AppealStatus[]} status - One or more states that validate the route.
 * @returns {import('express').RequestHandler<AppealParams>} - A guard scoped to the provided statuses.
 */
function createAppealStateGuard(status) {
	const statuses = Array.isArray(status) ? status : [status];

	return createAsyncHandler(async ({ params }, response, next) => {
		const appeal = await inspectorService.findAppealById(params.appealId);

		if (!statuses.includes(appeal.status)) {
			// In the first instance, attempt to redirect to the appeal page. If this
			// page is also unavailable, then its own guard will handle it
			response.redirect(`/inspector/appeals/${params.appealId}`);
		} else {
			next();
		}
	});
}
