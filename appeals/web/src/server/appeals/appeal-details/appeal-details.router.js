import { Router as createRouter } from 'express';
import asyncRoute from '#lib/async-route.js';
import lpaQuestionnaireRouter from './lpa-questionnaire/lpa-questionnaire.router.js';
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
import { auditRouter } from './audit/audit.router.js';
import * as controller from './appeal-details.controller.js';
import changePageRouter from '../change-page/change-page.router.js';
import issueDecisionRouter from './issue-decision/issue-decision.router.js';
import appealTypeChangeRouter from './change-appeal-type/change-appeal-type.router.js';
import linkedAppealsRouter from './manage-linked-appeals/manage-linked-appeals.router.js';
import otherAppealsRouter from './other-appeals/other-appeals.router.js';

const router = createRouter();

router.route('/:appealId').get(asyncRoute(controller.viewAppealDetails));
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
router.use('/:appealId/issue-decision', issueDecisionRouter);
router.use('/:appealId/change-appeal-type', appealTypeChangeRouter);
router.use('/:appealId/linked-appeals', linkedAppealsRouter);
router.use('/:appealId/other-appeals', otherAppealsRouter);
router.use('/:appealId/audit', auditRouter);
export default router;
