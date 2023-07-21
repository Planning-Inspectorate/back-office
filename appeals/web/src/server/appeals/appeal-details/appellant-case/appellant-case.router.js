import { Router as createRouter } from 'express';
import * as controller from './appellant-case.controller.js';
import * as validators from './appellant-case.validators.js';
import outcomeInvalidRouter from './outcome-invalid/outcome-invalid.router.js';
import outcomeIncompleteRouter from './outcome-incomplete/outcome-incomplete.router.js';

import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getAppellantCase)
	.post(
		validators.validateReviewOutcome,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postAppellantCase
	);

router.use('/invalid', outcomeInvalidRouter);
router.use('/incomplete', outcomeIncompleteRouter);

router
	.route('/check-your-answers')
	.get(controller.getCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		controller.postCheckAndConfirm
	);

export default router;
