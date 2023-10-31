import { registerCase } from '@pins/applications.web/src/server/applications/case/applications-case.locals.js';
import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';
import { registerCaseId } from '../../create-new-case/applications-create.locals.js';
import * as controller from './applications-project-team.controller.js';

const applicationsProjectTeamRouter = createRouter({ mergeParams: true });

applicationsProjectTeamRouter.use(assertDomainTypeIsNotInspector, registerCaseId);

applicationsProjectTeamRouter
	.route('/')
	.get(registerCase, asyncRoute(controller.viewProjectTeamListPage));

applicationsProjectTeamRouter
	.route('/search')
	.get(asyncRoute(controller.viewProjectTeamSearchPage));

export default applicationsProjectTeamRouter;
