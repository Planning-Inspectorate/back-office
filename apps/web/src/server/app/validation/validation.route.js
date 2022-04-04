import express from 'express';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import {
	getValidationDashboard,
	getReviewAppeal,
	postAppealOutcome,
	getValidAppealOutcome,
	postValidAppealDetails,
	getInvalidAppealOutcome,
	postInvalidAppealOutcome,
	getIncompleteAppealOutcome,
	postIncompleteAppealOutcome,
	getCheckAndConfirm,
	postCheckAndConfirm,
	getReviewAppealComplete,
	editAppellantName,
	updateAppellantName,
	editAppealSite,
	updateAppealSite,
	editLocalPlanningDepartment,
	updateLocalPlanningDepartment,
	editPlanningApplicationReference,
	updatePlanningApplicationReference,
	editDocuments,
	uploadDocuments
} from './validation.controller.js';
import {
	validateOutcomePipe,
	validateValidAppealDetails,
	validateOutcomeInvalidReason,
	validateOutcomeIncompletePipe,
	validateCheckAndConfirmPipe,
	validateAppellantName,
	validateAppealSite,
	validatePlanningApplicationReference,
	validateLocalPlanningDepartment,
	handleUploadedDocuments
} from './validation.pipes.js';
import { appealDataGuard } from './validation.guards.js';

const router = express.Router();

router
	.route('/review-appeal/:appealId')
	.get(createAsyncHandler(getReviewAppeal))
	.post(appealDataGuard, validateOutcomePipe(), expressValidationErrorsInterceptor, postAppealOutcome);

router
	.route('/review-appeal/:appealId/appeal-site')
	.get(createAsyncHandler(editAppealSite))
	.post(validateAppealSite, expressValidationErrorsInterceptor, createAsyncHandler(updateAppealSite));

router
	.route('/review-appeal/:appealId/appellant-name')
	.get(createAsyncHandler(editAppellantName))
	.post(validateAppellantName, expressValidationErrorsInterceptor, createAsyncHandler(updateAppellantName));

router
	.route('/review-appeal/:appealId/local-planning-department')
	.get(createAsyncHandler(editLocalPlanningDepartment))
	.post(validateLocalPlanningDepartment, expressValidationErrorsInterceptor, createAsyncHandler(updateLocalPlanningDepartment));

router
	.route('/review-appeal/:appealId/planning-application-reference')
	.get(createAsyncHandler(editPlanningApplicationReference))
	.post(validatePlanningApplicationReference, expressValidationErrorsInterceptor, createAsyncHandler(updatePlanningApplicationReference));

router
	.route('/review-appeal/:appealId/documents/:documentType')
	.get(createAsyncHandler(editDocuments))
	.post(handleUploadedDocuments, expressValidationErrorsInterceptor, createAsyncHandler(uploadDocuments));

// Main validation route `/validation`
router.route('/').get(getValidationDashboard);

// * All appeal outcomes routes
// Valid appeal outcome
router
	.route(`/${routes.validAppealOutcome.path}`)
	.get(appealDataGuard, getValidAppealOutcome)
	.post(appealDataGuard, validateValidAppealDetails(), expressValidationErrorsInterceptor, postValidAppealDetails);

// Invalid appeal outcome
router
	.route(`/${routes.invalidAppealOutcome.path}`)
	.get(appealDataGuard, getInvalidAppealOutcome)
	.post(appealDataGuard, validateOutcomeInvalidReason(), expressValidationErrorsInterceptor, postInvalidAppealOutcome);

// Incomplete appeal outcome
router
	.route(`/${routes.incompleteAppealOutcome.path}`)
	.get(appealDataGuard, getIncompleteAppealOutcome)
	.post(appealDataGuard, validateOutcomeIncompletePipe(), expressValidationErrorsInterceptor, postIncompleteAppealOutcome);

// Check and confirm appeal outcome details
router
	.route(`/${routes.checkAndConfirm.path}`)
	.get(appealDataGuard, getCheckAndConfirm)
	.post(appealDataGuard, validateCheckAndConfirmPipe(), expressValidationErrorsInterceptor, postCheckAndConfirm);

router.route(`/${routes.reviewAppealComplete.path}`).get(appealDataGuard, getReviewAppealComplete);

export default router;
