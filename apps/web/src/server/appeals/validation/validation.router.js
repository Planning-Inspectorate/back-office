import { Router as createRouter } from 'express';
import * as controller from './validation.controller.js';
import * as guards from './validation.guards.js';
import * as locals from './validation.locals.js';
import * as validators from './validation.validators.js';

const router = createRouter();

router.use(locals.registerValidationLocals);
router.route('/').get(controller.viewDashboard);

router.param('appealId', locals.loadAppeal);

router
	.route('/appeals/:appealId')
	.get(controller.viewAppeal)
	.post(validators.validateReviewOutcomeStatus, controller.updateAppealOutcome);

router
	.route('/appeals/:appealId/appeal-site')
	.get(controller.editAppealSite)
	.post(validators.validateAppealSite, controller.updateAppealSite);

router
	.route('/appeals/:appealId/appellant-name')
	.get(controller.editAppellantName)
	.post(validators.validateAppellantName, controller.updateAppellantName);

router
	.route('/appeals/:appealId/local-planning-department')
	.get(controller.editLocalPlanningDepartment)
	.post(validators.validateLocalPlanningDepartment, controller.updateLocalPlanningDepartment);

router
	.route('/appeals/:appealId/planning-application-reference')
	.get(controller.editPlanningApplicationReference)
	.post(
		validators.validatePlanningApplicationReference,
		controller.updatePlanningApplicationReference
	);

router.param('documentType', locals.addDocumentType);

router
	.route('/appeals/:appealId/documents/:documentType')
	.all(guards.assertIncompleteAppeal)
	.get(controller.editDocuments)
	.post(validators.validateAppealDocuments, controller.uploadDocuments);

router
	.route('/appeals/:appealId/review-outcome')
	.all(guards.assertReviewOutcomeStatusInSession)
	.get(controller.newReviewOutcome)
	.post(validators.validateReviewOutcome, controller.createReviewOutcome);

router
	.route('/appeals/:appealId/review-outcome/confirm')
	.all(guards.assertReviewOutcomeInSession)
	.get(controller.viewReviewOutcomeConfirmation)
	.post(validators.validateReviewOutcomeConfirmation, controller.confirmReviewOutcome);

export default router;
