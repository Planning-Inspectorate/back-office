import { Router as createRouter } from 'express';
// import config from '@pins/appeals.web/environment/config.js';
// import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import * as controller from './assign-user.controller.js';
import * as validators from './assign-user.validator.js';

const router = createRouter({ mergeParams: true });

router
	.route('/case-officer')
	.get(controller.getAssignCaseOfficer)
	.post(validators.validateSearchTerm, controller.postAssignCaseOfficer);

router
	.route('/inspector')
	.get(controller.getAssignInspector)
	.post(validators.validateSearchTerm, controller.postAssignInspector);

router
	.route('/case-officer/:assigneeId/confirm')
	.get(controller.getAssignCaseOfficerCheckAndConfirm)
	.post(validators.validatePostCheckAndConfirm, controller.postAssignCaseOfficerCheckAndConfirm);

router
	.route('/inspector/:assigneeId/confirm')
	.get(controller.getAssignInspectorCheckAndConfirm)
	.post(validators.validatePostCheckAndConfirm, controller.postAssignInspectorCheckAndConfirm);

export default router;
