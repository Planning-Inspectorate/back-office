import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import {
	getValidationDashboard,
	getReviewAppeal,
	postAppealOutcome,
	getValidAppealOutcome,
	getInvalidAppealOutcome,
	getIncompleteAppealOutcome
} from './validation.controller.js';
import { validateOutcomePipe } from './validation.pipes.js';
import { appealDataGuard } from './validation.guards.js';

const router = express.Router();

// Main validation route `/validation`
router.route('/').get(getValidationDashboard);

// Review appeal and complete outcome form
router.route(`/${routes.reviewAppealRoute.path}/:appealId`)
	.get(getReviewAppeal)
	.post(validateOutcomePipe(), expressValidationErrorsInterceptor, postAppealOutcome);

// All appeal outcomes routes
router.route(`/${routes.validAppealOutcome.path}`).get(appealDataGuard, getValidAppealOutcome);
router.route(`/${routes.invalidAppealOutcome.path}`).get(appealDataGuard, getInvalidAppealOutcome);
router.route(`/${routes.incompleteAppealOutcome.path}`).get(appealDataGuard, getIncompleteAppealOutcome);

export default router;
