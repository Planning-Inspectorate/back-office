import { Router as createRouter } from 'express';
import * as lpaQuestionnaireController from './lpa-questionnaire.controller.js';
import * as validators from './lpa-questionnaire.validators.js';
import outcomeIncompleteRouter from './outcome-incomplete/outcome-incomplete.router.js';

import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';

const router = createRouter({ mergeParams: true });

router
	.route('/:lpaQId')
	.get(lpaQuestionnaireController.getLpaQuestionnaire)
	.post(
		validators.validateReviewOutcome,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		lpaQuestionnaireController.postLpaQuestionnaire
	);

router.use('/:lpaQId/incomplete', outcomeIncompleteRouter);
router
	.route('/:lpaQId/check-your-answers')
	.get(lpaQuestionnaireController.getCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		lpaQuestionnaireController.postCheckAndConfirm
	);

export default router;
