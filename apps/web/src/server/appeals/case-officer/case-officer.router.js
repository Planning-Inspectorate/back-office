import { Router as createRouter } from 'express';
import * as controller from './case-officer.controller.js';
import * as guards from './case-officer.guards.js';
import * as locals from './case-officer.locals.js';
import * as validators from './case-officer.validators.js';

const router = createRouter();

router.use(locals.registerCaseOfficerLocals);
router.route('/').get(controller.viewDashboard);

router.param('appealId', locals.loadAppeal);
router.route('/appeals/:appealId').get(controller.viewAppeal);

router
	.route('/appeals/:appealId/questionnaire')
	.post(validators.validateQuestionnaireReview, controller.createQuestionnaireReview);

router
	.route('/appeals/:appealId/questionnaire/complete')
	.all(guards.assertIncompleteQuestionnaire)
	.post(validators.validateQuestionnaireReviewCompletion, controller.createQuestionnaireReview);

router
	.route('/appeals/:appealId/questionnaire/confirm')
	.all(guards.assertQuestionnaireReviewExists)
	.get(controller.viewQuestionnaireReviewConfirmation)
	.post(validators.validateQuestionnaireReviewConfirmation, controller.confirmQuestionnaireReview);

router
	.route('/appeals/:fullPlanningAppealId/final-comments')
	.all(guards.assertFinalCommentsRequired)
	.get(controller.newFinalComments)
	.post(validators.validateDocuments, controller.uploadFinalComments);

router.param('fullPlanningAppealId', locals.loadFullPlanningAppeal);

router
	.route('/appeals/:fullPlanningAppealId/statements')
	.all(guards.assertStatementsRequired)
	.get(controller.newStatements)
	.post(validators.validateDocuments, controller.uploadStatements);

router
	.route('/appeals/:appealId/edit-listed-building-description')
	.all(guards.assertListedBuildingDescriptionMissingOrIncorrect)
	.get(controller.editListedBuildingDescription)
	.post(validators.validateListedBuildingDescription, controller.updateListedBuildingDescription);

router
	.param('documentType', locals.addDocumentType)
	.route('/appeals/:appealId/documents/:documentType')
	.all(guards.assertDocumentTypeMissingOrIncorrect)
	.get(controller.newAppealDocuments)
	.post(validators.validateDocuments, controller.uploadAppealDocuments);

export default router;
