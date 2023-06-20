import { Router as createRouter } from 'express';
import enterStartDateRouter from '../enter-start-date/enter-start-date.router.js';
import startDateEnteredRouter from '../start-date-entered/start-date-entered.router.js';
import lpaQuestionnaireReviewRouter from './lpa-questionaire-review/lpa-questionnaire-review.router.js';
import appellantCaseRouter from '../appellant-case/appellant-case.router.js';
import * as controller from './appeal-details.controller.js';

const router = createRouter();

router.route('/:appealId').get(controller.viewAppealDetails);
router.use('/:appealId/lpa-questionnaire-review', lpaQuestionnaireReviewRouter);
router.use('/:appealId/enter-start-date', enterStartDateRouter);
router.use('/:appealId/start-date-entered', startDateEnteredRouter);
router.use('/:appealId/appellant-case', appellantCaseRouter);

export default router;
