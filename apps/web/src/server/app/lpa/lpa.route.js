import express from 'express';
import { expressValidationErrorsInterceptor } from '../../lib/express-validation-errors.js';
import { validateQuestionnairePipe } from './lpa.pipes.js';

import {
	getLpaDashboard,
	getReviewQuestionnaire,
	postReviewQuestionnaire

} from './lpa.controller.js';

const router = express.Router();

// Main lpa route `/lpa`
router.route('/').get(getLpaDashboard);

// Review questionnaire page
router.route('/review-questionnaire/:appealId')
	.get(getReviewQuestionnaire)
	.post(validateQuestionnairePipe(), expressValidationErrorsInterceptor, postReviewQuestionnaire);

export default router;
