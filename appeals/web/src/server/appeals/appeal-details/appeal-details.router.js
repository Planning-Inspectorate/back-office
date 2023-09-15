import { Router as createRouter } from 'express';
import lpaQuestionnaireRouter from './lpa-questionaire/lpa-questionnaire.router.js';
import appellantCaseRouter from './appellant-case/appellant-case.router.js';
import appealDocumentsRouter from '../appeal-documents/appeal-documents.router.js';
import siteVisitRouter from './site-visit/site-visit.router.js';
import {
	assignUserRouter,
	unassignUserRouter,
	assignNewUserRouter
} from './assign-user/assign-user.router.js';
import * as controller from './appeal-details.controller.js';

const router = createRouter();

router.route('/:appealId').get(controller.viewAppealDetails);
router.use('/:appealId/documents', appealDocumentsRouter);
router.use('/:appealId/lpa-questionnaire', lpaQuestionnaireRouter);
router.use('/:appealId/appellant-case', appellantCaseRouter);
router.use('/:appealId/site-visit', siteVisitRouter);
router.use('/:appealId/assign-user', assignUserRouter);
router.use('/:appealId/unassign-user', unassignUserRouter);
router.use('/:appealId/assign-new-user', assignNewUserRouter);

export default router;
