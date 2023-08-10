import { Router as createRouter } from 'express';
import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import * as validators from './site-visit.validators.js';
import * as controller from './site-visit.controller.js';

const router = createRouter({ mergeParams: true });

router
	.route('/schedule-visit')
	.get(controller.getScheduleSiteVisit)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateScheduleSiteVisit,
		validators.validateVisitDate,
		validators.validateVisitStartTime,
		validators.validateVisitEndTime,
		controller.postScheduleSiteVisit
	);

router.route('/visit-scheduled').get(controller.getSiteVisitScheduled);

export default router;
