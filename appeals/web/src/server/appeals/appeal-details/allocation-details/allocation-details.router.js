import { Router as createRouter } from 'express';
import config from '#environment/config.js';
import asyncRoute from '#lib/async-route.js';
import * as allocationDetailsController from './allocation-details.controller.js';
import * as validators from './allocation-details.validators.js';
import { validateAppeal } from '../appeal-details.middleware.js';
import { assertGroupAccess } from '#app/auth/auth.guards.js';

const router = createRouter({ mergeParams: true });

router
	.route('/allocation-level')
	.get(validateAppeal, asyncRoute(allocationDetailsController.getAllocationDetailsLevels))
	.post(
		validateAppeal,
		validators.validateAllocationDetailsLevels,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(allocationDetailsController.postAllocationDetailsLevels)
	);

router
	.route('/allocation-specialism')
	.get(validateAppeal, asyncRoute(allocationDetailsController.getAllocationDetailsSpecialism))
	.post(
		validateAppeal,
		validators.validateAllocationDetailsSpecialisms,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(allocationDetailsController.postAllocationDetailsSpecialism)
	);

router
	.route('/check-answers')
	.get(validateAppeal, asyncRoute(allocationDetailsController.getAllocationDetailsCheckAnswers))
	.post(
		validateAppeal,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(allocationDetailsController.postAllocationDetailsCheckAnswers)
	);

export default router;
