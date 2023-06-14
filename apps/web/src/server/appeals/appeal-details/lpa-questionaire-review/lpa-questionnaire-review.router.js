import { Router as createRouter } from 'express';
import * as lpaQuestionnaireController from './lpa-questionnaire-review.controller.js';
const router = createRouter({ mergeParams: true });

router.route('/:lpaQId').get(lpaQuestionnaireController.viewLpaQuestionnaire);

export default router;
