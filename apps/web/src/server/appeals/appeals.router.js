import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { assertGroupAccess } from '../app/auth/auth.guards.js';
import nationalListRouter from '../appeals/national-list/national-list.router.js';
import appealDetailsRouter from './appeal-details/appeal-details.router.js';
const router = createRouter();

const groupIds = config.referenceData.appeals;

router.use(
	'/appeals-list',
	assertGroupAccess(
		groupIds.validationOfficerGroupId,
		groupIds.caseOfficerGroupId,
		groupIds.inspectorGroupId
	),
	nationalListRouter
);

router.use(
	'/appeal-details',
	assertGroupAccess(
		groupIds.validationOfficerGroupId,
		groupIds.caseOfficerGroupId,
		groupIds.inspectorGroupId
	),
	appealDetailsRouter
);

export default router;
