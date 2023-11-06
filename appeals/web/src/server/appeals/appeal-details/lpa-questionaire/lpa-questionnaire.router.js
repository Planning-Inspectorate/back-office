import { Router as createRouter } from 'express';
import * as controller from './lpa-questionnaire.controller.js';
import * as validators from './lpa-questionnaire.validators.js';
import * as documentsValidators from '../../appeal-documents/appeal-documents.validators.js';
import outcomeIncompleteRouter from './outcome-incomplete/outcome-incomplete.router.js';
import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import {
	validateCaseFolderId,
	validateCaseDocumentId
} from '../../appeal-documents/appeal-documents.middleware.js';
import asyncRoute from '#lib/async-route.js';
import changePageRouter from '../../question-page/question-page.router.js';

const router = createRouter({ mergeParams: true });

router
	.route('/:lpaQuestionnaireId')
	.get(controller.getLpaQuestionnaire)
	.post(
		validators.validateReviewOutcome,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postLpaQuestionnaire
	);

router.use('/:lpaQuestionnaireId/incomplete', outcomeIncompleteRouter);
router
	.route('/:lpaQuestionnaireId/check-your-answers')
	.get(controller.getCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postCheckAndConfirm
	);

router.route('/:lpaQuestionnaireId/confirmation').get(controller.getConfirmation);

router
	.route('/:lpaQuestionnaireId/add-documents/:folderId/:documentId?')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getAddDocuments));
router.use('/:lpaQuestionnaireId/change-lpa-questionnaire', changePageRouter);

router
	.route('/:lpaQId/add-document-details/:folderId')
	.get(validateCaseFolderId, controller.getAddDocumentDetails)
	.post(
		validateCaseFolderId,
		documentsValidators.validateDocumentDetailsBodyFormat,
		documentsValidators.validateDocumentDetailsReceivedDatesFields,
		documentsValidators.validateDocumentDetailsReceivedDateValid,
		documentsValidators.validateDocumentDetailsRedactionStatuses,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postAddDocumentDetails
	);

export default router;
