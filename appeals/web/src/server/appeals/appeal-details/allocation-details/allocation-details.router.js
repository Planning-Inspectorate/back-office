import { Router as createRouter } from 'express';
import * as allocationDetailsController from './allocation-details.controller.js';
import * as validators from './allocation-details.validators.js';
import { validateAppeal } from '../appeal-details.middleware.js';
import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';

const router = createRouter({ mergeParams: true });

router
	.route('/allocation-level')
	.get(validateAppeal, allocationDetailsController.getAllocationDetailsLevels)
	.post(
		validateAppeal,
		validators.validateAllocationDetailsLevels,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		allocationDetailsController.postAllocationDetailsLevels
	);

router
	.route('/allocation-specialism')
	.get(validateAppeal, allocationDetailsController.getAllocationDetailsSpecialism)
	.post(
		validateAppeal,
		validators.validateAllocationDetailsSpecialisms,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		allocationDetailsController.postAllocationDetailsSpecialism
	);

router
	.route('/check-answers')
	.get(validateAppeal, allocationDetailsController.getAllocationDetailsCheckAnswers)
	.post(
		validateAppeal,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		allocationDetailsController.postAllocationDetailsCheckAnswers
	);

export default router;
