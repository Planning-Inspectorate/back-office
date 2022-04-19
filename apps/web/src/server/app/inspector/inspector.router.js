import express from 'express';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
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
	bookSiteVisitGuard,
	canBookSiteVisitGuard,
	canIssueDecisionGuard,
	issueDecisionGuard
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
	.post(
		validateAvailableAppeals,
		expressValidationErrorsInterceptor,
		createAsyncHandler(assignAvailableAppeals)
	);

router.route('/appeals/:appealId').get(createAsyncHandler(viewAppealDetails));

router
	.route('/appeals/:appealId/book-site-visit')
	.get(canBookSiteVisitGuard, createAsyncHandler(newSiteVisit))
	.post(validateBookSiteVisit, createAsyncHandler(createSiteVisit));

router
	.route('/appeals/:appealId/confirm-site-visit')
	.get(bookSiteVisitGuard, createAsyncHandler(viewSiteVisitConfirmation))
	.post(bookSiteVisitGuard, createAsyncHandler(confirmSiteVisit));

router
	.route('/appeals/:appealId/issue-decision')
	.get(canIssueDecisionGuard, createAsyncHandler(newDecision))
	.post(
		validateIssueDecision,
		createAsyncHandler(createDecision)
	);

router
	.route('/appeals/:appealId/confirm-decision')
	.get(issueDecisionGuard, createAsyncHandler(viewDecisionConfirmation))
	.post(createAsyncHandler(confirmDecision));

router
	.route('/appeals/:appealId/confirm-decision/download-decision-letter')
	.get(downloadDecisionLetter);

export default router;
