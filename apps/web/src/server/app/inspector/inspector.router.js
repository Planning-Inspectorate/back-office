import express from 'express';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
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

const router = express.Router();

router.param('appealId', (req, _, next, appealId) => {
	req.params.appealId = Number.parseInt(appealId, 10);
	next();
});

router.route('/').get(createAsyncHandler(viewDashboard));

router
	.route('/available-appeals')
	.get(createAsyncHandler(viewAvailableAppeals))
	.post(validateAvailableAppeals, createAsyncHandler(assignAvailableAppeals));

router.route('/appeals/:appealId').get(createAsyncHandler(viewAppealDetails));

router
	.route('/appeals/:appealId/book-site-visit')
	.all(assertCanBookSiteVisit)
	.get(createAsyncHandler(newSiteVisit))
	.post(validateBookSiteVisit, createAsyncHandler(createSiteVisit));

router
	.route('/appeals/:appealId/confirm-site-visit')
	.all(assertSiteVisitInSession, assertCanBookSiteVisit)
	.get(createAsyncHandler(viewSiteVisitConfirmation))
	.post(createAsyncHandler(confirmSiteVisit));

router
	.route('/appeals/:appealId/issue-decision')
	.all(assertCanIssueDecision)
	.get(createAsyncHandler(newDecision))
	.post(validateIssueDecision, createAsyncHandler(createDecision));

router
	.route('/appeals/:appealId/confirm-decision')
	.all(assertDecisionInSession, assertCanIssueDecision)
	.get(createAsyncHandler(viewDecisionConfirmation))
	.post(createAsyncHandler(confirmDecision));

router
	.route('/appeals/:appealId/confirm-decision/download-decision-letter')
	.get(downloadDecisionLetter);

export default router;
