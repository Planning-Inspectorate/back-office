import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';
import { lpaReviewQuestionnairePipe, lpaCheckAndConfirmQuestionnairePipe } from './lpa.pipes.js';
import { postReviewQuestionnaireGuard, checkAndConfirmGuard, getReviewCompleteGuard } from './lpa.guards.js';

import {
	getLpaDashboard,
	getReviewQuestionnaire,
	postReviewQuestionnaire,
	getCheckAndConfirm,
	postCheckAndConfirm,
	getReviewComplete
} from './lpa.controller.js';

const router = express.Router();

// Main lpa route `/lpa`
router.route('/').get(getLpaDashboard);

// Review questionnaire page
router.route(`/${routes.reviewQuestionnaire.path}/:appealId`)
	.get(getReviewQuestionnaire)
	.post(postReviewQuestionnaireGuard, lpaReviewQuestionnairePipe, expressValidationErrorsInterceptor, postReviewQuestionnaire);

router.route(`/${routes.checkAndConfirm.path}`)
	.get(checkAndConfirmGuard, getCheckAndConfirm)
	.post(checkAndConfirmGuard, lpaCheckAndConfirmQuestionnairePipe, expressValidationErrorsInterceptor, postCheckAndConfirm);

router.route(`/${routes.reviewQuestionnaireComplete.path}`)
	.get(getReviewCompleteGuard, getReviewComplete);

export default router;
