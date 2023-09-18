import { Router as createRouter } from 'express';
import config from '@pins/appeals.web/environment/config.js';
import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import * as controller from './assign-user.controller.js';
import * as validators from './assign-user.validator.js';

const assignUserRouter = createRouter({ mergeParams: true });

assignUserRouter
	.route('/case-officer')
	.get(controller.getAssignCaseOfficer)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSearchTerm,
		controller.postAssignCaseOfficer
	);

assignUserRouter
	.route('/inspector')
	.get(controller.getAssignInspector)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validateSearchTerm,
		controller.postAssignInspector
	);

assignUserRouter
	.route('/case-officer/:assigneeId/confirm')
	.get(controller.getAssignCaseOfficerCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		controller.postAssignCaseOfficerCheckAndConfirm
	);

assignUserRouter
	.route('/inspector/:assigneeId/confirm')
	.get(controller.getAssignInspectorCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		controller.postAssignInspectorCheckAndConfirm
	);

const unassignUserRouter = createRouter({ mergeParams: true });

unassignUserRouter
	.route('/case-officer/:assigneeId/confirm')
	.get(controller.getUnassignCaseOfficerCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		controller.postUnassignCaseOfficerCheckAndConfirm
	);

unassignUserRouter
	.route('/inspector/:assigneeId/confirm')
	.get(controller.getUnassignInspectorCheckAndConfirm)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		controller.postUnassignInspectorCheckAndConfirm
	);

const assignNewUserRouter = createRouter({ mergeParams: true });

assignNewUserRouter
	.route('/case-officer')
	.get(controller.getAssignNewCaseOfficer)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		controller.postAssignNewCaseOfficer
	);

assignNewUserRouter
	.route('/inspector')
	.get(controller.getAssignNewInspector)
	.post(
		assertGroupAccess(config.referenceData.appeals.caseOfficerGroupId),
		validators.validatePostConfirmation,
		controller.postAssignNewInspector
	);

export { assignUserRouter, unassignUserRouter, assignNewUserRouter };
