import { Router as createRouter } from 'express';
import config from '#environment/config.js';
import asyncRoute from '#lib/async-route.js';
import * as controller from './appellant-case.controller.js';
import * as validators from './appellant-case.validators.js';
import * as documentsValidators from '../../appeal-documents/appeal-documents.validators.js';
import outcomeValidRouter from './outcome-valid/outcome-valid.router.js';
import outcomeInvalidRouter from './outcome-invalid/outcome-invalid.router.js';
import outcomeIncompleteRouter from './outcome-incomplete/outcome-incomplete.router.js';
import { assertGroupAccess } from '#app/auth/auth.guards.js';
import {
	validateCaseFolderId,
	validateCaseDocumentId
} from '../../appeal-documents/appeal-documents.middleware.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(asyncRoute(controller.getAppellantCase))
	.post(
		validators.validateReviewOutcome,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(controller.postAppellantCase)
	);

router.use('/valid', outcomeValidRouter);
router.use('/invalid', outcomeInvalidRouter);
router.use('/incomplete', outcomeIncompleteRouter);

router
	.route('/check-your-answers')
	.get(asyncRoute(controller.getCheckAndConfirm))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(controller.postCheckAndConfirm)
	);

router
	.route('/add-documents/:folderId')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getAddDocuments));

router
	.route('/add-documents/:folderId/:documentId')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getAddDocumentsVersion));

router
	.route('/add-document-details/:folderId')
	.get(validateCaseFolderId, asyncRoute(controller.getAddDocumentDetails))
	.post(
		validateCaseFolderId,
		documentsValidators.validateDocumentDetailsBodyFormat,
		documentsValidators.validateDocumentDetailsReceivedDatesFields,
		documentsValidators.validateDocumentDetailsReceivedDateValid,
		documentsValidators.validateDocumentDetailsReceivedDateIsNotFutureDate,
		documentsValidators.validateDocumentDetailsRedactionStatuses,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(controller.postAddDocumentDetails)
	);

router
	.route('/add-document-details/:folderId/:documentId')
	.get(validateCaseFolderId, asyncRoute(controller.getAddDocumentVersionDetails))
	.post(
		validateCaseFolderId,
		documentsValidators.validateDocumentDetailsBodyFormat,
		documentsValidators.validateDocumentDetailsReceivedDatesFields,
		documentsValidators.validateDocumentDetailsReceivedDateValid,
		documentsValidators.validateDocumentDetailsReceivedDateIsNotFutureDate,
		documentsValidators.validateDocumentDetailsRedactionStatuses,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(controller.postDocumentVersionDetails)
	);

router
	.route('/manage-documents/:folderId/')
	.get(validateCaseFolderId, asyncRoute(controller.getManageFolder));

router
	.route('/manage-documents/:folderId/:documentId')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getManageDocument));

router
	.route('/change-document-details/:folderId/:documentId')
	.get(validateCaseFolderId, asyncRoute(controller.getChangeDocumentVersionDetails))
	.post(
		validateCaseFolderId,
		documentsValidators.validateDocumentDetailsBodyFormat,
		documentsValidators.validateDocumentDetailsReceivedDatesFields,
		documentsValidators.validateDocumentDetailsReceivedDateValid,
		documentsValidators.validateDocumentDetailsReceivedDateIsNotFutureDate,
		documentsValidators.validateDocumentDetailsRedactionStatuses,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(controller.postChangeDocumentVersionDetails)
	);

router
	.route('/manage-documents/:folderId/:documentId/:versionId/delete')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getDeleteDocument))
	.post(
		validateCaseFolderId,
		validateCaseDocumentId,
		documentsValidators.validateDocumentDeleteAnswer,
		asyncRoute(controller.postDeleteDocument)
	);

export default router;
