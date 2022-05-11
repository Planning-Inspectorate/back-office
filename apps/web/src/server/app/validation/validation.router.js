import { Router as createRouter } from 'express';
import { lowerCase } from 'lodash-es';
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

router.route('/').get(viewDashboard);

router
	.route('/appeals/:appealId')
	.get(viewAppeal)
	.post(validators.validateReviewOutcomeStatus, updateAppealOutcome);

router
	.route('/appeals/:appealId/appeal-site')
	.get(editAppealSite)
	.post(validators.validateAppealSite, updateAppealSite);

router
	.route('/appeals/:appealId/appellant-name')
	.get(editAppellantName)
	.post(validators.validateAppellantName, updateAppellantName);

router
	.route('/appeals/:appealId/local-planning-department')
	.get(editLocalPlanningDepartment)
	.post(validators.validateLocalPlanningDepartment, updateLocalPlanningDepartment);

router
	.route('/appeals/:appealId/planning-application-reference')
	.get(editPlanningApplicationReference)
	.post(validators.validatePlanningApplicationReference, updatePlanningApplicationReference);

router
	.route('/appeals/:appealId/documents/:documentType')
	.all(assertIncompleteAppeal)
	.get(editDocuments)
	.post(validators.validateAppealDocuments, uploadDocuments);

router
	.route('/appeals/:appealId/review-outcome')
	.all(assertCanReviewAppeal, assertReviewOutcomeStatusInSession)
	.get(newReviewOutcome)
	.post(validators.validateReviewOutcome, createReviewOutcome);

router
	.route('/appeals/:appealId/review-outcome/confirm')
	.all(assertCanReviewAppeal, assertReviewOutcomeInSession)
	.get(viewReviewOutcomeConfirmation)
	.post(validators.validateReviewOutcomeConfirmation, confirmReviewOutcome);

export default router;
