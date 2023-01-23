import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { assertGroupAccess } from '../app/auth/auth.guards.js';
import CaseOfficerRouter from '../appeals/case-officer/case-officer.router.js';
import inspectorRouter from './inspector/inspector.router.js';
import validationRouter from './validation/validation.router.js';

const router = createRouter();

router.use(
	'/validation',
	assertGroupAccess(config.referenceData.appeals.validationOfficerGroupId),
	validationRouter
);

router.use(
	'/case-officer',
	assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
	CaseOfficerRouter
);

router.use(
	'/inspector',
	assertGroupAccess(config.referenceData.appeals.inspectorGroupId),
	inspectorRouter
);

export default router;
