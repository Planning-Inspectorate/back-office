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
import { canReviewAppeal, hasReviewOutcome, hasReviewOutcomeStatus } from './validation.guards.js';
import * as validators from './validation.pipes.js';

/** @typedef {import('@pins/appeals').Validation.AppealDocumentType} AppealDocumentType */

/**
 * @typedef {object} AppealParams
 * @property {number} appealId - Unique identifier for the appeal.
 */

/**
 * @typedef {object} AppealDocumentsParams
 * @property {number} appealId
 * @property {AppealDocumentType} documentType
 */

const router = express.Router();

router.param(
	'appealId',
	(/** @type {import('express').Request<any>} */ request, _, next, appealId) => {
		request.params.appealId = Number.parseInt(appealId, 10);
		next();
	}
);

router.param('documentType', (request, _, next, documentType) => {
	request.params.documentType = lowerCase(documentType);
	next();
});

router.route('/').get(createAsyncHandler(viewDashboard));

router
	.route('/appeals/:appealId')
	.get(createAsyncHandler(viewAppeal))
	.post(validators.validateReviewOutcomeStatus, createAsyncHandler(updateAppealOutcome));

router
	.route('/appeals/:appealId/appeal-site')
	.get(createAsyncHandler(editAppealSite))
	.post(validators.validateAppealSite, createAsyncHandler(updateAppealSite));

router
	.route('/appeals/:appealId/appellant-name')
	.get(createAsyncHandler(editAppellantName))
	.post(validators.validateAppellantName, createAsyncHandler(updateAppellantName));

router
	.route('/appeals/:appealId/local-planning-department')
	.get(createAsyncHandler(editLocalPlanningDepartment))
	.post(
		validators.validateLocalPlanningDepartment,
		createAsyncHandler(updateLocalPlanningDepartment)
	);

router
	.route('/appeals/:appealId/planning-application-reference')
	.get(createAsyncHandler(editPlanningApplicationReference))
	.post(
		validators.validatePlanningApplicationReference,
		createAsyncHandler(updatePlanningApplicationReference)
	);

router
	.route('/appeals/:appealId/documents/:documentType')
	.get(createAsyncHandler(editDocuments))
	.post(validators.validateAppealDocuments, createAsyncHandler(uploadDocuments));

router
	.route('/appeals/:appealId/review-outcome')
	.get(canReviewAppeal, hasReviewOutcomeStatus, createAsyncHandler(newReviewOutcome))
	.post(
		canReviewAppeal,
		validators.validateReviewOutcome,
		createAsyncHandler(createReviewOutcome)
	);

router
	.route('/appeals/:appealId/review-outcome/confirm')
	.get(canReviewAppeal, hasReviewOutcome, createAsyncHandler(viewReviewOutcomeConfirmation))
	.post(
		canReviewAppeal,
		hasReviewOutcome,
		validators.validateReviewOutcomeConfirmation,
		createAsyncHandler(confirmReviewOutcome)
	);

export default router;
