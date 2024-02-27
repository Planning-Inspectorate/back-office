import { Router as createRouter } from 'express';
import config from '#environment/config.js';
import asyncRoute from '#lib/async-route.js';
import * as appealTimetablesController from './appeal-timetables.controller.js';
import * as validators from './appeal-timetables.validators.js';
import { assertGroupAccess } from '#app/auth/auth.guards.js';
import { validateAppeal } from '../appeal-details.middleware.js';

const router = createRouter({ mergeParams: true });

router
	.route('/:timetableType')
	.get(validateAppeal, asyncRoute(appealTimetablesController.getDueDate))
	.post(
		validateAppeal,
		validators.validateDueDateFields,
		validators.validateDueDateValid,
		validators.validateDueDateInFuture,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		asyncRoute(appealTimetablesController.postDueDate)
	);

router
	.route('/:timetableType/confirmation')
	.get(validateAppeal, asyncRoute(appealTimetablesController.getConfirmation));

export default router;
