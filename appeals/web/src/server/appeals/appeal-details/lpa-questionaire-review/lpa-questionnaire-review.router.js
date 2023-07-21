import { Router as createRouter } from 'express';
import * as lpaQuestionnaireController from './lpa-questionnaire-review.controller.js';
import * as validators from './lpa-questionnaire-review.validators.js';

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

export default router;
