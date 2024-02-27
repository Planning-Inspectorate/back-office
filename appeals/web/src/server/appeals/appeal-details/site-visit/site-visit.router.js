import { Router as createRouter } from 'express';
import config from '#environment/config.js';
import asyncRoute from '#lib/async-route.js';
import { assertGroupAccess } from '#app/auth/auth.guards.js';
import * as validators from './site-visit.validators.js';
import * as controller from './site-visit.controller.js';

const router = createRouter({ mergeParams: true });

router
	.route('/schedule-visit')
	.get(asyncRoute(controller.getScheduleSiteVisit))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSiteVisitType,
		validators.validateVisitDateFields,
		validators.validateVisitDateValid,
		validators.validateVisitDateInFuture,
		validators.validateVisitStartTime,
		validators.validateVisitEndTime,
		validators.validateVisitStartTimeBeforeEndTime,
		asyncRoute(controller.postScheduleSiteVisit)
	);

router
	.route('/manage-visit')
	.get(asyncRoute(controller.getManageSiteVisit))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSiteVisitType,
		validators.validateVisitDateFields,
		validators.validateVisitDateValid,
		validators.validateVisitDateInFuture,
		validators.validateVisitStartTime,
		validators.validateVisitEndTime,
		validators.validateVisitStartTimeBeforeEndTime,
		asyncRoute(controller.postManageSiteVisit)
	);

router
	.route('/visit-scheduled/:confirmationPageTypeToRender')
	.get(asyncRoute(controller.getSiteVisitScheduled));

router
	.route('/set-visit-type')
	.get(asyncRoute(controller.getSetVisitType))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSiteVisitType,
		asyncRoute(controller.postSetVisitType)
	);

router.route('/visit-booked').get(asyncRoute(controller.getSiteVisitBooked));

export default router;
