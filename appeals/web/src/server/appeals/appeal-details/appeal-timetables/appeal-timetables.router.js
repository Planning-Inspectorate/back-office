import { Router as createRouter } from 'express';
import * as appealTimetablesController from './appeal-timetables.controller.js';
import * as validators from './appeal-timetables.validators.js';
import { validateAppeal } from '../appeal-details.middleware.js';
import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';

const router = createRouter({ mergeParams: true });

router
	.route('/:timetableType')
	.get(validateAppeal, appealTimetablesController.getDueDate)
	.post(
		validateAppeal,
		validators.validateDueDate,
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		appealTimetablesController.postDueDate
	);

router
	.route('/:timetableType/confirmation')
	.get(validateAppeal, appealTimetablesController.getConfirmation);

export default router;
