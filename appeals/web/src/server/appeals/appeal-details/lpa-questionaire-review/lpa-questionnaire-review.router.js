import { Router as createRouter } from 'express';
import * as lpaQuestionnaireController from './lpa-questionnaire-review.controller.js';
import * as validators from './lpa-questionnaire-review.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/:lpaQId')
	.get(lpaQuestionnaireController.getLpaQuestionnaire)
	.post(validators.validateReviewOutcome, lpaQuestionnaireController.postLpaQuestionnaire);

export default router;
