import { Router as createRouter } from 'express';
import lpaQuestionnaireRouter from './lpa-questionaire/lpa-questionnaire.router.js';
import allocationDetailsRouter from './allocation-details/allocation-details.router.js';
import appealTimetablesRouter from './appeal-timetables/appeal-timetables.router.js';
import appellantCaseRouter from './appellant-case/appellant-case.router.js';
import appealDocumentsRouter from '../appeal-documents/appeal-documents.router.js';
import siteVisitRouter from './site-visit/site-visit.router.js';
import {
	assignUserRouter,
	unassignUserRouter,
	assignNewUserRouter
} from './assign-user/assign-user.router.js';
import * as controller from './appeal-details.controller.js';
import changePageRouter from '../question-page/question-page.router.js';

const router = createRouter();

router.route('/:appealId').get(controller.viewAppealDetails);
router.use('/:appealId/documents', appealDocumentsRouter);
router.use('/:appealId/lpa-questionnaire', lpaQuestionnaireRouter);
router.use('/:appealId/allocation-details', allocationDetailsRouter);
router.use('/:appealId/appeal-timetables', appealTimetablesRouter);
router.use('/:appealId/appellant-case', appellantCaseRouter);
router.use('/:appealId/site-visit', siteVisitRouter);
router.use('/:appealId/assign-user', assignUserRouter);
router.use('/:appealId/unassign-user', unassignUserRouter);
router.use('/:appealId/assign-new-user', assignNewUserRouter);
router.use('/:appealId/change-appeal-details', changePageRouter);
export default router;
