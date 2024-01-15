import { registerCase } from '@pins/applications.web/src/server/applications/case/applications-case.locals.js';
import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { registerCaseId } from '../../create-new-case/applications-create.locals.js';
import * as controller from './applications-project-team.controller.js';
import {
	validateApplicationsProjectTeamMinLengthSearch,
	validateApplicationsProjectTeamNotEmptySearch,
	validateApplicationsProjectTeamRole
} from './applications-project-team.validators.js';

const applicationsProjectTeamRouter = createRouter({ mergeParams: true });

applicationsProjectTeamRouter.use(registerCaseId);

applicationsProjectTeamRouter
	.route('/')
	.get(registerCase, asyncHandler(controller.viewProjectTeamListPage));

applicationsProjectTeamRouter
	.route('/:userId/choose-role')
	.get(asyncHandler(controller.viewProjectTeamChooseRolePage))
	.post(validateApplicationsProjectTeamRole, asyncHandler(controller.updateProjectTeamChooseRole));

applicationsProjectTeamRouter
	.route('/:userId/remove')
	.get(asyncHandler(controller.viewProjectTeamRemovePage))
	.post(validateApplicationsProjectTeamRole, asyncHandler(controller.updateProjectTeamRemove));

applicationsProjectTeamRouter
	.route('/search')
	.get(asyncHandler(controller.viewProjectTeamSearchPage))
	.post(
		validateApplicationsProjectTeamNotEmptySearch,
		validateApplicationsProjectTeamMinLengthSearch,
		asyncHandler(controller.viewProjectTeamSearchPage)
	);

export default applicationsProjectTeamRouter;
