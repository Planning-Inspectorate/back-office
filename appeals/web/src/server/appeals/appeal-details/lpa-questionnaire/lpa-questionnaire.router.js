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
import changePageRouter from '../../change-page/change-page.router.js';

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
router.use('/:lpaQuestionnaireId/change-lpa-questionnaire', changePageRouter);

router
	.route('/:lpaQuestionnaireId/add-documents/:folderId')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getAddDocuments));
router
	.route('/:lpaQuestionnaireId/add-documents/:folderId/:documentId')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getAddDocumentsVersion));

router
	.route('/:lpaQuestionnaireId/add-document-details/:folderId')
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

router
	.route('/:lpaQuestionnaireId/add-document-details/:folderId/:documentId')
	.get(validateCaseFolderId, controller.getAddDocumentVersionDetails)
	.post(
		validateCaseFolderId,
		documentsValidators.validateDocumentDetailsBodyFormat,
		documentsValidators.validateDocumentDetailsReceivedDatesFields,
		documentsValidators.validateDocumentDetailsReceivedDateValid,
		documentsValidators.validateDocumentDetailsRedactionStatuses,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postDocumentVersionDetails
	);

router
	.route('/:lpaQuestionnaireId/manage-documents/:folderId/')
	.get(validateCaseFolderId, controller.getManageFolder);

router
	.route('/:lpaQuestionnaireId/manage-documents/:folderId/:documentId/:versionId')
	.get(validateCaseFolderId, validateCaseDocumentId, controller.getManageDocument)
	.post(validateCaseFolderId, validateCaseDocumentId, controller.postAddDocumentDetails);

router
	.route('/:lpaQuestionnaireId/change-document-details/:folderId/:documentId')
	.get(validateCaseFolderId, controller.getChangeDocumentVersionDetails)
	.post(
		validateCaseFolderId,
		documentsValidators.validateDocumentDetailsBodyFormat,
		documentsValidators.validateDocumentDetailsReceivedDatesFields,
		documentsValidators.validateDocumentDetailsReceivedDateValid,
		documentsValidators.validateDocumentDetailsReceivedDateIsNotFutureDate,
		documentsValidators.validateDocumentDetailsRedactionStatuses,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postChangeDocumentVersionDetails
	);

router
	.route('/:lpaQuestionnaireId/manage-documents/:folderId/:documentId/:versionId/delete')
	.get(validateCaseFolderId, validateCaseDocumentId, controller.getDeleteDocument)
	.post(
		validateCaseFolderId,
		validateCaseDocumentId,
		documentsValidators.validateDocumentDeleteAnswer,
		controller.postDeleteDocument
	);

export default router;
