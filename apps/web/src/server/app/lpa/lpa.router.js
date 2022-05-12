import { Router as createRouter } from 'express';
import { lowerCase } from 'lodash-es';
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

const router = createRouter();

router.param('appealId', ({ params }, _, next) => {
	const appealId = Number.parseInt(params.appealId, 10);

	params.appealId = /** @type {*} */ (appealId);
	next();
});

router.param('documentType', (request, _, next, documentType) => {
	request.params.documentType = lowerCase(documentType);
	next();
});

// Main lpa route `/lpa`
router.route('/').get(viewDashboard);

router.route('/appeals/:appealId').get(viewAppeal);

router
	.route('/appeals/:appealId/questionnaire')
	.post(validateQuestionnaireReview, createQuestionnaireReview);

router
	.route('/appeals/:appealId/questionnaire/complete')
	.all(assertIncompleteQuestionnaire)
	.post(validateQuestionnaireReviewCompletion, createQuestionnaireReview);

router
	.route('/appeals/:appealId/questionnaire/confirm')
	.all(assertQuestionnaireReviewExists)
	.get(viewQuestionnaireReviewConfirmation)
	.post(validateQuestionnaireReviewConfirmation, confirmQuestionnaireReview);

router
	.route('/appeals/:appealId/final-comments')
	.all(assertFinalCommentsRequired)
	.get(newFinalComments)
	.post(validateDocuments, uploadFinalComments);

router
	.route('/appeals/:appealId/statements')
	.all(assertStatementsRequired)
	.get(newStatements)
	.post(validateDocuments, uploadStatements);

router
	.route('/appeals/:appealId/edit-listed-building-description')
	.all(assertListedBuildingDescriptionMissingOrIncorrect)
	.get(editListedBuildingDescription)
	.post(validateListedBuildingDescription, updateListedBuildingDescription);

router
	.route('/appeals/:appealId/documents/:documentType')
	.all(assertDocumentTypeMissingOrIncorrect)
	.get(newAppealDocuments)
	.post(validateDocuments, uploadAppealDocuments);

export default router;
