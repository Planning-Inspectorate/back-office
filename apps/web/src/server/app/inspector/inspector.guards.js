// @ts-check

import { createAsyncHandler } from '../../lib/async-error-handler.js';
import * as inspectorSession from './inspector-session.service.js';
import * as inspectorService from './inspector.service.js';

/** @typedef {import('@pins/inspector').AppealStatus} AppealStatus */

/** @type {import('express').RequestHandler<any>} */
export function bookSiteVisitGuard({ params, session }, response, next) {
	// if no site visit exists within the session, redirect to inspector root
	if (inspectorSession.getSiteVisit(session, params.appealId)) {
		next();
	} else {
		response.redirect('/inspector');
	}
}

/** @type {import('express').RequestHandler<any>} */
export function issueDecisionGuard({ params, session }, response, next) {
	// if no decision exists within the session, redirect to inspector root
	if (inspectorSession.getDecision(session, params.appealId)) {
		next();
	} else {
		response.redirect('/inspector');
	}
}

export const canBookSiteVisitGuard = createAppealStateGuard('not yet booked');
export const canIssueDecisionGuard = createAppealStateGuard('decision due');

/**
 * Create a guard that ensures a requested appeal is in one of the expected states.
 *
 * @param {AppealStatus | AppealStatus[]} status - One or more states that validate the route.
 * @returns {import('express').RequestHandler} - A guard scoped to the provided statuses.
 */
function createAppealStateGuard(status) {
	const statuses = Array.isArray(status) ? status : [status];

	return createAsyncHandler(async ({ params }, response, next) => {
		const appeal = await inspectorService.findAppealById(params);

		// TODO: inverted for now to allow fall through
		if (statuses.includes(appeal.status)) {
			// In the first instance, attempt to redirect to the appeal page. If this
			// page is also unavailable, then its own guard will handle it
			response.redirect(`/inspector/appeals/${params.appealId}`);
		} else {
			next();
		}
	});
}
