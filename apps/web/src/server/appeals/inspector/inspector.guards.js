import { composeMiddleware } from '@pins/express';
import * as inspectorService from './inspector.service.js';
import * as inspectorSession from './inspector-session.service.js';

/** @typedef {import('@pins/appeals').Inspector.AppealStatus} AppealStatus */
/** @typedef {import('./inspector.locals').AppealLocals} AppealLocals */

/** @type {import('@pins/express').RequestHandler<AppealLocals>} */
export function assertSiteVisitInSession({ baseUrl, locals, session }, res, next) {
	// if no site visit exists within the session, redirect to inspector root
	if (inspectorSession.getSiteVisit(session, locals.appealId)) {
		next();
	} else {
		res.redirect(baseUrl);
	}
}

/** @type {import('@pins/express').RequestHandler<AppealLocals>} */
export function assertDecisionInSession({ baseUrl, locals, session }, res, next) {
	// if no decision exists within the session, redirect to inspector root
	if (inspectorSession.getDecision(session, locals.appealId)) {
		next();
	} else {
		res.redirect(baseUrl);
	}
}

export const assertCanBookSiteVisit = composeMiddleware(
	createAppealStateGuard('not yet booked'),
	/** @type {import('@pins/express').RequestHandler<AppealLocals>} - A guard scoped to the provided statuses. */
	async ({ baseUrl, locals }, res, next) => {
		const appeal = await inspectorService.findAppealById(locals.appealId);

		if (appeal.availableForSiteVisitBooking) {
			next();
		} else {
			// In the first instance, attempt to redirect to the appeal page. If this
			// page is also unavailable, then its own guard will handle it
			res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
		}
	}
);

export const assertCanIssueDecision = createAppealStateGuard('decision due');

/**
 * Create a guard that ensures a requested appeal is in one of the expected states.
 *
 * @param {AppealStatus | AppealStatus[]} status
 * @returns {import('@pins/express').RequestHandler<AppealLocals>}
 */
function createAppealStateGuard(status) {
	const statuses = Array.isArray(status) ? status : [status];

	return async ({ baseUrl, locals }, res, next) => {
		const appeal = await inspectorService.findAppealById(locals.appealId);

		if (!statuses.includes(appeal.status)) {
			// In the first instance, attempt to redirect to the appeal page. If this
			// page is also unavailable, then its own guard will handle it
			res.redirect(`${baseUrl}/appeals/${locals.appealId}`);
		} else {
			next();
		}
	};
}
