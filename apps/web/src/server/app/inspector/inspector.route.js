// @ts-check

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
import { bookSiteVisitGuard, canBookSiteVisitGuard, canIssueDecisionGuard } from './inspector.guards.js';
import { handleDecision, validateAvailableAppeals, validateSiteVisit } from './inspector.pipes.js';

const router = express.Router();

router.route('/').get(createAsyncHandler(viewDashboard));

router
	.route('/available-appeals')
	.get(createAsyncHandler(viewAvailableAppeals))
	.post(validateAvailableAppeals, expressValidationErrorsInterceptor, createAsyncHandler(assignAvailableAppeals));

router.route('/appeals/:appealId').get(createAsyncHandler(viewAppealDetails));

router
	.route('/appeals/:appealId/book-site-visit')
	.get(canBookSiteVisitGuard, createAsyncHandler(newSiteVisit))
	.post(validateSiteVisit, expressValidationErrorsInterceptor, createAsyncHandler(createSiteVisit));

router
	.route('/appeals/:appealId/confirm-site-visit')
	.get(bookSiteVisitGuard, createAsyncHandler(viewSiteVisitConfirmation))
	.post(validateSiteVisit, expressValidationErrorsInterceptor, createAsyncHandler(confirmSiteVisit));

router
	.route('/appeals/:appealId/issue-decision')
	.get(canIssueDecisionGuard, createAsyncHandler(newDecision))
	.post(...handleDecision, expressValidationErrorsInterceptor, createAsyncHandler(createDecision));

router
	.route('/appeals/:appealId/confirm-decision')
	.get(canIssueDecisionGuard, createAsyncHandler(viewDecisionConfirmation))
	.post(expressValidationErrorsInterceptor, createAsyncHandler(confirmDecision));

router.route('/appeals/:appealId/confirm-decision/download-decision-letter').get(downloadDecisionLetter);

export default router;
