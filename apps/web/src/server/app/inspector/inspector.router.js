import { Router as createRouter } from 'express';
import {
	assignAvailableAppeals,
	confirmDecision,
	confirmSiteVisit,
	createDecision,
	createSiteVisit,
	downloadDecisionLetter,
	newDecision,
	newSiteVisit,
	viewAppealDetails,
	viewAvailableAppeals,
	viewDashboard,
	viewDecisionConfirmation,
	viewSiteVisitConfirmation
} from './inspector.controller.js';
import {
	assertCanBookSiteVisit,
	assertCanIssueDecision,
	assertDecisionInSession,
	assertSiteVisitInSession
} from './inspector.guards.js';
import {
	validateAvailableAppeals,
	validateBookSiteVisit,
	validateIssueDecision
} from './inspector.pipes.js';

/**
 * @typedef {object} AppealParams
 * @property {number} appealId - Unique identifier for the appeal
 */

const router = createRouter();

router.param('appealId', ({ params }, _, next) => {
	const appealId = Number.parseInt(params.appealId, 10);

	params.appealId = /** @type {*} */ (appealId);
	next();
});

router.route('/').get(viewDashboard);

router
	.route('/available-appeals')
	.get(viewAvailableAppeals)
	.post(validateAvailableAppeals, assignAvailableAppeals);

router.route('/appeals/:appealId').get(viewAppealDetails);

router
	.route('/appeals/:appealId/book-site-visit')
	.all(assertCanBookSiteVisit)
	.get(newSiteVisit)
	.post(validateBookSiteVisit, createSiteVisit);

router
	.route('/appeals/:appealId/confirm-site-visit')
	.all(assertSiteVisitInSession, assertCanBookSiteVisit)
	.get(viewSiteVisitConfirmation)
	.post(confirmSiteVisit);

router
	.route('/appeals/:appealId/issue-decision')
	.all(assertCanIssueDecision)
	.get(newDecision)
	.post(validateIssueDecision, createDecision);

router
	.route('/appeals/:appealId/confirm-decision')
	.all(assertDecisionInSession, assertCanIssueDecision)
	.get(viewDecisionConfirmation)
	.post(confirmDecision);

router
	.route('/appeals/:appealId/confirm-decision/download-decision-letter')
	.get(downloadDecisionLetter);

export default router;
