import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { assertGroupAccess } from '../app/auth/auth.guards.js';
import caseOfficerRouter from '../appeals/case-officer/case-officer.router.js';
import nationalListRouter from '../appeals/national-list/national-list.router.js';
import appealDetailsRouter from './appeal-details/appeal-details.router.js';
import inspectorRouter from './inspector/inspector.router.js';
import validationRouter from './validation/validation.router.js';

const router = createRouter();

router.use('/appeals-list', nationalListRouter);
router.use('/appeal-details', appealDetailsRouter);

router.use(
	'/validation',
	assertGroupAccess(config.referenceData.appeals.validationOfficerGroupId),
	validationRouter
);

router.use(
	'/case-officer',
	assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
	caseOfficerRouter
);

router.use(
	'/inspector',
	assertGroupAccess(config.referenceData.appeals.inspectorGroupId),
	inspectorRouter
);

export default router;
