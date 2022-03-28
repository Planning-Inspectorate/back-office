import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { lpaRoutesConfig as routes } from '../../config/routes.js';
import { validateQuestionnairePipe } from './lpa.pipes.js';

import {
	getLpaDashboard,
	getReviewQuestionnaire,
	postReviewQuestionnaire,
	getCheckAndConfirm

} from './lpa.controller.js';

const router = express.Router();

// Main lpa route `/lpa`
router.route('/').get(getLpaDashboard);

// Review questionnaire page
router.route(`/${routes.reviewQuestionnaire.path}/:appealId`)
	.get(getReviewQuestionnaire)
	.post(validateQuestionnairePipe(), expressValidationErrorsInterceptor, postReviewQuestionnaire);

router.route(`/${routes.checkAndConfirm.path}`)
	.get(getCheckAndConfirm);

export default router;
