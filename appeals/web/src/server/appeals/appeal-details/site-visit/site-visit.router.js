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
		validators.validateSiteVisitType,
		validators.validateVisitDate,
		validators.validateVisitStartTime,
		validators.validateVisitEndTime,
		validators.validateVisitStartTimeBeforeEndTime,
		controller.postScheduleSiteVisit
	);

router.route('/visit-scheduled').get(controller.getSiteVisitScheduled);

router
	.route('/set-visit-type')
	.get(controller.getSetVisitType)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSiteVisitType,
		controller.postSetVisitType
	);

export default router;
