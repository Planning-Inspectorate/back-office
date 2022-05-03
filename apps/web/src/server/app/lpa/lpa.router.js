import express from 'express';
import { lowerCase } from 'lodash-es';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
import {
	confirmQuestionnaireReview,
	createQuestionnaireReview,
	editListedBuildingDescription,
	newAppealDocuments,
	newFinalComments,
	newStatements,
	updateListedBuildingDescription,
	uploadAppealDocuments,
	uploadFinalComments,
	uploadStatements,
	viewAppeal,
	viewDashboard,
	viewQuestionnaireReviewConfirmation
} from './lpa.controller.js';
import {
	assertDocumentTypeMissingOrIncorrect,
	assertFinalCommentsRequired,
	assertIncompleteQuestionnaire,
	assertListedBuildingDescriptionMissingOrIncorrect,
	assertQuestionnaireReviewExists,
	assertStatementsRequired
} from './lpa.guards.js';
import {
	validateDocuments,
	validateListedBuildingDescription,
	validateQuestionnaireReview,
	validateQuestionnaireReviewCompletion,
	validateQuestionnaireReviewConfirmation
} from './lpa.pipes.js';

/** @typedef {import('@pins/appeals').DocumentType} DocumentType */

/**
 * @typedef {object} AppealParams
 * @property {number} appealId
 */

/**
 * @typedef {object} AppealDocumentParams
 * @property {number} appealId
 * @property {DocumentType} documentType
 */

const router = express.Router();

router.param('appealId', (req, _, next, appealId) => {
	req.params.appealId = Number.parseInt(appealId, 10);
	next();
});

router.param('documentType', (request, _, next, documentType) => {
	request.params.documentType = lowerCase(documentType);
	next();
});

// Main lpa route `/lpa`
router.route('/').get(createAsyncHandler(viewDashboard));

router.route('/appeals/:appealId').get(createAsyncHandler(viewAppeal));

router
	.route('/appeals/:appealId/questionnaire')
	.post(validateQuestionnaireReview, createAsyncHandler(createQuestionnaireReview));

router
	.route('/appeals/:appealId/questionnaire/complete')
	.all(assertIncompleteQuestionnaire)
	.post(validateQuestionnaireReviewCompletion, createAsyncHandler(createQuestionnaireReview));

router
	.route('/appeals/:appealId/questionnaire/confirm')
	.all(assertQuestionnaireReviewExists)
	.get(createAsyncHandler(viewQuestionnaireReviewConfirmation))
	.post(validateQuestionnaireReviewConfirmation, createAsyncHandler(confirmQuestionnaireReview));

router
	.route('/appeals/:appealId/final-comments')
	.all(assertFinalCommentsRequired)
	.get(createAsyncHandler(newFinalComments))
	.post(validateDocuments, createAsyncHandler(uploadFinalComments));

router
	.route('/appeals/:appealId/statements')
	.all(assertStatementsRequired)
	.get(createAsyncHandler(newStatements))
	.post(validateDocuments, createAsyncHandler(uploadStatements));

router
	.route('/appeals/:appealId/edit-listed-building-description')
	.all(assertListedBuildingDescriptionMissingOrIncorrect)
	.get(createAsyncHandler(editListedBuildingDescription))
	.post(validateListedBuildingDescription, createAsyncHandler(updateListedBuildingDescription));

router
	.route('/appeals/:appealId/documents/:documentType')
	.all(assertDocumentTypeMissingOrIncorrect)
	.get(createAsyncHandler(newAppealDocuments))
	.post(validateDocuments, createAsyncHandler(uploadAppealDocuments));

export default router;
