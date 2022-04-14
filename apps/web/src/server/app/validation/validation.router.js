import * as validation from '@pins/validation';
import express from 'express';
import { lowerCase } from 'lodash-es';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
import {
	confirmReviewOutcome,
	createReviewOutcome,
	editAppealSite,
	editAppellantName,
	editDocuments,
	editLocalPlanningDepartment,
	editPlanningApplicationReference,
	newReviewOutcome,
	updateAppealOutcome,
	updateAppealSite,
	updateAppellantName,
	updateLocalPlanningDepartment,
	updatePlanningApplicationReference,
	uploadDocuments,
	viewAppeal,
	viewDashboard,
	viewReviewOutcomeConfirmation
} from './validation.controller.js';
import { hasReviewOutcome, hasReviewOutcomeStatus } from './validation.guards.js';
import { handleUploadedDocuments, validateAppealSite, validateReviewOutcome, validateReviewOutcomeConfirmation } from './validation.pipes.js';

const router = express.Router();

router.route('/').get(viewDashboard);

router
	.route('/appeals/:appealId')
	.get(createAsyncHandler(viewAppeal))
	.post(validation.validateReviewOutcomeStatus, createAsyncHandler(updateAppealOutcome));

router
	.route('/appeals/:appealId/appeal-site')
	.get(createAsyncHandler(editAppealSite))
	.post(validateAppealSite, createAsyncHandler(updateAppealSite));

router
	.route('/appeals/:appealId/appellant-name')
	.get(createAsyncHandler(editAppellantName))
	.post(validation.validateAppellantName, createAsyncHandler(updateAppellantName));

router
	.route('/appeals/:appealId/local-planning-department')
	.get(createAsyncHandler(editLocalPlanningDepartment))
	.post(validation.validateLocalPlanningDepartment, createAsyncHandler(updateLocalPlanningDepartment));

router
	.route('/appeals/:appealId/planning-application-reference')
	.get(createAsyncHandler(editPlanningApplicationReference))
	.post(validation.validatePlanningApplicationReference, createAsyncHandler(updatePlanningApplicationReference));

router
	.route('/appeals/:appealId/documents/:documentType')
	.get(createAsyncHandler(editDocuments))
	.post(handleUploadedDocuments, createAsyncHandler(uploadDocuments));

router
	.route('/appeals/:appealId/review-outcome')
	.get(hasReviewOutcomeStatus, newReviewOutcome)
	.post(validateReviewOutcome, createAsyncHandler(createReviewOutcome));

router
	.route('/appeals/:appealId/review-outcome/confirm')
	.get(hasReviewOutcome, createAsyncHandler(viewReviewOutcomeConfirmation))
	.post(hasReviewOutcome, validateReviewOutcomeConfirmation, createAsyncHandler(confirmReviewOutcome));

router.param('appealId', (req, _, next, appealId) => {
	req.params.appealId = Number.parseInt(appealId, 10);
	next();
});

router.param('documentType', (req, _, next, documentType) => {
	req.params.documentType = lowerCase(documentType);
	next();
});

export default router;
