import { Router as createRouter } from 'express';
// import config from '@pins/appeals.web/environment/config.js';
// import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import * as controller from './assign-user.controller.js';
import * as validators from './assign-user.validator.js';

const assignUserRouter = createRouter({ mergeParams: true });

assignUserRouter
	.route('/case-officer')
	.get(controller.getAssignCaseOfficer)
	.post(validators.validateSearchTerm, controller.postAssignCaseOfficer);

assignUserRouter
	.route('/inspector')
	.get(controller.getAssignInspector)
	.post(validators.validateSearchTerm, controller.postAssignInspector);

assignUserRouter
	.route('/case-officer/:assigneeId/confirm')
	.get(controller.getAssignCaseOfficerCheckAndConfirm)
	.post(validators.validatePostCheckAndConfirm, controller.postAssignCaseOfficerCheckAndConfirm);

assignUserRouter
	.route('/inspector/:assigneeId/confirm')
	.get(controller.getAssignInspectorCheckAndConfirm)
	.post(validators.validatePostCheckAndConfirm, controller.postAssignInspectorCheckAndConfirm);

const unassignUserRouter = createRouter({ mergeParams: true });

unassignUserRouter
	.route('/case-officer/:assigneeId/confirm')
	.get(controller.getUnassignCaseOfficerCheckAndConfirm)
	.post(validators.validatePostCheckAndConfirm, controller.postUnassignCaseOfficerCheckAndConfirm);

unassignUserRouter
	.route('/inspector/:assigneeId/confirm')
	.get(controller.getUnassignInspectorCheckAndConfirm)
	.post(validators.validatePostCheckAndConfirm, controller.postUnassignInspectorCheckAndConfirm);

export { assignUserRouter, unassignUserRouter };
