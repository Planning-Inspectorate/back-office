import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import {
	getChangeAppealSite,
	getChangeApplicationReference,
	getChangeLpaName,
	getChangeAppellantName,
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
	getReviewAppealComplete
} from './validation.controller.js';
import {
	validateOutcomePipe, validateValidAppealDetails, validateOutcomeInvalidReason, validateOutcomeIncompletePipe, validateCheckAndConfirmPipe
} from './validation.pipes.js';
import { appealDataGuard } from './validation.guards.js';

const router = express.Router();

// Main validation route `/validation`
router.route('/').get(getValidationDashboard);

// Review appeal and complete outcome form
router.route(`/${routes.reviewAppealRoute.path}/:appealId`)
	.get(getReviewAppeal)
	.post(appealDataGuard, validateOutcomePipe(), expressValidationErrorsInterceptor, postAppealOutcome);

// * All appeal outcomes routes
// Valid appeal outcome
router.route(`/${routes.validAppealOutcome.path}`)
	.get(appealDataGuard, getValidAppealOutcome)
	.post(appealDataGuard, validateValidAppealDetails(), expressValidationErrorsInterceptor, postValidAppealDetails);

// Invalid appeal outcome
router.route(`/${routes.invalidAppealOutcome.path}`)
	.get(appealDataGuard, getInvalidAppealOutcome)
	.post(appealDataGuard, validateOutcomeInvalidReason(), expressValidationErrorsInterceptor, postInvalidAppealOutcome);

// Incomplete appeal outcome
router.route(`/${routes.incompleteAppealOutcome.path}`)
	.get(appealDataGuard, getIncompleteAppealOutcome)
	.post(appealDataGuard, validateOutcomeIncompletePipe(), expressValidationErrorsInterceptor, postIncompleteAppealOutcome);

// Check and confirm appeal outcome details
router.route(`/${routes.checkAndConfirm.path}`)
	.get(appealDataGuard, getCheckAndConfirm)
	.post(appealDataGuard, validateCheckAndConfirmPipe(), expressValidationErrorsInterceptor, postCheckAndConfirm);

router.route(`/${routes.reviewAppealComplete.path}`).get(appealDataGuard, getReviewAppealComplete);

// Change Appellant Name
router.route(`/${routes.changeAppellantName.path}`)
	.get(getChangeAppellantName)
	.post(getChangeAppellantName);


// Change LPA Name
router.route(`/${routes.changeLpaName.path}`)
	.get(getChangeLpaName)
	.post(getChangeLpaName);

// Change Application Reference
router.route(`/${routes.changeApplicationReference.path}`)
	.get(getChangeApplicationReference)
	.post(getChangeApplicationReference);

// Change Appeal Site
router.route(`/${routes.changeAppealSite.path}`)
	.get(getChangeAppealSite)
	.post(getChangeAppealSite);

export default router;
