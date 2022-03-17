import express from 'express';
import {
	getValidationDashboard,
	getAppealDetails,
	postAppealOutcome,
	getOutcomeIncomplete,
	postOutcomeIncomplete,
	getCheckAndConfirm
} from './validation.controller.js';
import { validateOutcomePipe, validateOutcomeIncompletePipe } from './validation.pipes.js';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';

const router = express.Router();

// Main validation route `/validation`
router.route('/')
	.get(getValidationDashboard);

// Appeal details route `/validation/review-appeal/:appealId`
// Handles the initial GET of the appeal details and form submission checks
router.route('/review-appeal/:appealId')
	.get(getAppealDetails)
	.post(validateOutcomePipe(), expressValidationErrorsInterceptor, postAppealOutcome);

// Outcome incomplete route
router.route('/outcome-incomplete/:appealId')
	.get(getOutcomeIncomplete)
	.post(validateOutcomeIncompletePipe(), expressValidationErrorsInterceptor, postOutcomeIncomplete);

// Check and confirm route
router.route('/check-confirm')
	.get(getCheckAndConfirm);

export default router;
