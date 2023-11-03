import { Router as createRouter } from 'express';
import * as controller from './appellant-case.controller.js';
import * as validators from './appellant-case.validators.js';
import * as documentsValidators from '../../appeal-documents/appeal-documents.validators.js';
import outcomeValidRouter from './outcome-valid/outcome-valid.router.js';
import outcomeInvalidRouter from './outcome-invalid/outcome-invalid.router.js';
import outcomeIncompleteRouter from './outcome-incomplete/outcome-incomplete.router.js';
import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import asyncRoute from '#lib/async-route.js';
import {
	validateCaseFolderId,
	validateCaseDocumentId
} from '../../appeal-documents/appeal-documents.middleware.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getAppellantCase)
	.post(
		validators.validateReviewOutcome,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postAppellantCase
	);

router.use('/valid', outcomeValidRouter);
router.use('/invalid', outcomeInvalidRouter);
router.use('/incomplete', outcomeIncompleteRouter);

router
	.route('/check-your-answers')
	.get(controller.getCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postCheckAndConfirm
	);

router
	.route('/add-documents/:folderId/:documentId?')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.getAddDocuments));

router
	.route('/add-document-details/:folderId')
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

router.route('/manage-documents/:folderId/').get(validateCaseFolderId, controller.getManageFolder);

router
	.route('/manage-documents/:folderId/:documentId')
	.get(validateCaseFolderId, validateCaseDocumentId, controller.getManageDocument);

export default router;
