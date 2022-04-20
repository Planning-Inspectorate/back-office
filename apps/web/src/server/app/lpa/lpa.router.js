import express from 'express';
import { lowerCase } from 'lodash-es';
import { createAsyncHandler } from '../../lib/async-error-handler.js';
import {
	confirmQuestionnaireReview,
	createQuestionnaireReview,
	editListedBuildingDescription,
	newAppealDocuments,
	updateListedBuildingDescription,
	uploadAppealDocuments,
	viewAppeal,
	viewDashboard,
	viewQuestionnaireReviewConfirmation
} from './lpa.controller.js';
import {
	assertDocumentTypeMissingOrIncorrect,
	assertListedBuildingDescriptionMissingOrIncorrect,
	assertQuestionnaireReviewExists
} from './lpa.guards.js';
import {
	validateAppealDocuments,
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
	.post(validateQuestionnaireReviewCompletion, createAsyncHandler(createQuestionnaireReview));

router
	.route('/appeals/:appealId/questionnaire/confirm')
	.get(assertQuestionnaireReviewExists, createAsyncHandler(viewQuestionnaireReviewConfirmation))
	.post(
		assertQuestionnaireReviewExists,
		validateQuestionnaireReviewConfirmation,
		createAsyncHandler(confirmQuestionnaireReview)
	);

router
	.route('/appeals/:appealId/edit-listed-building-description')
	.get(
		assertListedBuildingDescriptionMissingOrIncorrect,
		createAsyncHandler(editListedBuildingDescription)
	)
	.post(
		assertListedBuildingDescriptionMissingOrIncorrect,
		validateListedBuildingDescription,
		createAsyncHandler(updateListedBuildingDescription)
	);

router
	.route('/appeals/:appealId/documents/:documentType')
	.get(assertDocumentTypeMissingOrIncorrect, createAsyncHandler(newAppealDocuments))
	.post(
		assertDocumentTypeMissingOrIncorrect,
		validateAppealDocuments,
		createAsyncHandler(uploadAppealDocuments)
	);

export default router;
