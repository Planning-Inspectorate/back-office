import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';
import { lpaReviewQuestionnairePipe, lpaCheckAndConfirmQuestionnairePipe } from './lpa.pipes.js';
import { decideQuestionnaireReviewOutcomeGuard, checkAndConfirmGuard, viewReviewCompleteGuard } from './lpa.guards.js';

import {
	viewDashboard,
	viewReviewQuestionnaire,
	decideQuestionnaireReviewOutcome,
	viewCheckAndConfirm,
	confirmDecision,
	viewReviewComplete
} from './lpa.controller.js';

const router = express.Router();

// Main lpa route `/lpa`
router.route('/').get(viewDashboard);

// Review questionnaire page
router.route(`/${routes.reviewQuestionnaire.path}/:appealId`)
	.get(viewReviewQuestionnaire)
	.post(decideQuestionnaireReviewOutcomeGuard, lpaReviewQuestionnairePipe, expressValidationErrorsInterceptor, decideQuestionnaireReviewOutcome);

router.route(`/${routes.checkAndConfirm.path}/:appealId`)
	.get(checkAndConfirmGuard, viewCheckAndConfirm)
	.post(checkAndConfirmGuard, lpaCheckAndConfirmQuestionnairePipe, expressValidationErrorsInterceptor, confirmDecision);

router.route(`/${routes.reviewQuestionnaireComplete.path}/:appealId`)
	.get(viewReviewCompleteGuard, viewReviewComplete);

export default router;
