import config from '@pins/web/environment/config.js';
import { Router as createRouter } from 'express';
import { assertGroupAccess } from '../app/auth/auth.guards.js';
import caseOfficerRouter from '../appeals/case-officer/case-officer.router.js';
import inspectorRouter from './inspector/inspector.router.js';
import validationRouter from './validation/validation.router.js';

const router = createRouter();

// Temporary placeholder for router being developed in BOAT-55
import * as validationService from './validation/validation.service.js';
router.route('/appeals-list').get(async (req, response) => {
	const appeals = await validationService.findAllAppeals();

	response.render('appeals/all-appeals/dashboard.njk', {
		userRole: 'Case officer',
		appeals
	});
});

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
