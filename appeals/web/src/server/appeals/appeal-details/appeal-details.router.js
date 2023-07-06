import { Router as createRouter } from 'express';
import lpaQuestionnaireReviewRouter from './lpa-questionaire-review/lpa-questionnaire-review.router.js';
import appellantCaseRouter from '../appellant-case/appellant-case.router.js';
import appealDocumentsRouter from '../appeal-documents/appeal-documents.router.js';

import * as controller from './appeal-details.controller.js';

const router = createRouter();

router.route('/:appealId').get(controller.viewAppealDetails);
router.use('/:appealId/documents', appealDocumentsRouter);
router.use('/:appealId/lpa-questionnaire-review', lpaQuestionnaireReviewRouter);
router.use('/:appealId/appellant-case', appellantCaseRouter);

export default router;
