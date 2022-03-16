import express from 'express';
import { getValidationDashboard, getAppealDetails, postAppealOutcome } from './validation.controller.js';
import { validateOutcomePipe } from './validation.pipes.js';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';

const router = express.Router();

// Main validation route `/validation`
router.route('/')
	.get(getValidationDashboard);

// Appeal details route `/validation/appeal/:appealId`
// Handles the initial GET of the appeal details and form submission checks
router.route('/appeal/:appealId')
	.get(getAppealDetails)
	.post(validateOutcomePipe(), expressValidationErrorsInterceptor, postAppealOutcome);

export default router;
