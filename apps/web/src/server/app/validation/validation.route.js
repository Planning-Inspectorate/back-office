import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import {
	getValidationDashboard,
	getReviewAppeal,
	postAppealOutcome,
	getValidAppealOutcome,
	postValidAppealDetails,
	getInvalidAppealOutcome,
	getIncompleteAppealOutcome,
	getCheckAndConfirm
} from './validation.controller.js';
import { validateOutcomePipe, validateValidAppealDetails } from './validation.pipes.js';
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
router.route(`/${routes.invalidAppealOutcome.path}`).get(appealDataGuard, getInvalidAppealOutcome);

// Incomplete appeal outcome
router.route(`/${routes.incompleteAppealOutcome.path}`).get(appealDataGuard, getIncompleteAppealOutcome);

// Check and confirm appeal outcome details
router.route(`/${routes.checkAndConfirm.path}`).get(appealDataGuard, getCheckAndConfirm);
export default router;
