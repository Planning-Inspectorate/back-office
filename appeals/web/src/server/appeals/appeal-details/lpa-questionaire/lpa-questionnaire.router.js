import { Router as createRouter } from 'express';
import * as controller from './lpa-questionnaire.controller.js';
import * as validators from './lpa-questionnaire.validators.js';
import outcomeIncompleteRouter from './outcome-incomplete/outcome-incomplete.router.js';
import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import {
	validateCaseFolderId,
	validateCaseDocumentId
} from '../../appeal-documents/appeal-documents.middleware.js';
import asyncRoute from '#lib/async-route.js';

const router = createRouter({ mergeParams: true });

router
	.route('/:lpaQId')
	.get(controller.getLpaQuestionnaire)
	.post(
		validators.validateReviewOutcome,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postLpaQuestionnaire
	);

router.use('/:lpaQId/incomplete', outcomeIncompleteRouter);
router
	.route('/:lpaQId/check-your-answers')
	.get(controller.getCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postCheckAndConfirm
	);

router.route('/:lpaQId/confirmation').get(controller.getConfirmation);

router
	.route('/:lpaQId/add-documents/:folderId/:documentId?')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getAddDocuments));

export default router;
