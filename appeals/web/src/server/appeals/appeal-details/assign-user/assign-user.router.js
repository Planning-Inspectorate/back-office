import { Router as createRouter } from 'express';
import config from '#environment/config.js';
import asyncRoute from '#lib/async-route.js';
import { assertGroupAccess } from '#app/auth/auth.guards.js';
import * as controller from './assign-user.controller.js';
import * as validators from './assign-user.validator.js';

const assignUserRouter = createRouter({ mergeParams: true });

assignUserRouter
	.route('/case-officer')
	.get(asyncRoute(controller.getAssignCaseOfficer))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSearchTerm,
		asyncRoute(controller.postAssignCaseOfficer)
	);

assignUserRouter
	.route('/inspector')
	.get(asyncRoute(controller.getAssignInspector))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSearchTerm,
		asyncRoute(controller.postAssignInspector)
	);

assignUserRouter
	.route('/case-officer/:assigneeId/confirm')
	.get(asyncRoute(controller.getAssignCaseOfficerCheckAndConfirm))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		asyncRoute(controller.postAssignCaseOfficerCheckAndConfirm)
	);

assignUserRouter
	.route('/inspector/:assigneeId/confirm')
	.get(asyncRoute(controller.getAssignInspectorCheckAndConfirm))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		asyncRoute(controller.postAssignInspectorCheckAndConfirm)
	);

const unassignUserRouter = createRouter({ mergeParams: true });

unassignUserRouter
	.route('/inspector/:assigneeId/confirm')
	.get(asyncRoute(controller.getUnassignInspectorCheckAndConfirm))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		asyncRoute(controller.postUnassignInspectorCheckAndConfirm)
	);

const assignNewUserRouter = createRouter({ mergeParams: true });

assignNewUserRouter
	.route('/case-officer')
	.get(asyncRoute(controller.getAssignNewCaseOfficer))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		asyncRoute(controller.postAssignNewCaseOfficer)
	);

assignNewUserRouter
	.route('/inspector')
	.get(asyncRoute(controller.getAssignNewInspector))
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		asyncRoute(controller.postAssignNewInspector)
	);

export { assignUserRouter, unassignUserRouter, assignNewUserRouter };
