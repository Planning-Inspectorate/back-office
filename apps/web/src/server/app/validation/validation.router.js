import { Router as createRouter } from 'express';
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
import {
	assertCanReviewAppeal,
	assertIncompleteAppeal,
	assertReviewOutcomeInSession,
	assertReviewOutcomeStatusInSession
} from './validation.guards.js';
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

const router = createRouter();

router.param('appealId', ({ params }, _, next) => {
	const appealId = Number.parseInt(params.appealId, 10);

	params.appealId = /** @type {*} */ (appealId);
	next();
});

router.param('documentType', ({ params }, _, next) => {
	params.documentType = lowerCase(params.documentType);
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
	.all(assertIncompleteAppeal)
	.get(createAsyncHandler(editDocuments))
	.post(validators.validateAppealDocuments, createAsyncHandler(uploadDocuments));

router
	.route('/appeals/:appealId/review-outcome')
	.all(assertCanReviewAppeal, assertReviewOutcomeStatusInSession)
	.get(createAsyncHandler(newReviewOutcome))
	.post(validators.validateReviewOutcome, createAsyncHandler(createReviewOutcome));

router
	.route('/appeals/:appealId/review-outcome/confirm')
	.all(assertCanReviewAppeal, assertReviewOutcomeInSession)
	.get(createAsyncHandler(viewReviewOutcomeConfirmation))
	.post(validators.validateReviewOutcomeConfirmation, createAsyncHandler(confirmReviewOutcome));

export default router;
