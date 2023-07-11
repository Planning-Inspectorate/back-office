import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './project-updates.controller.js';
import * as validators from './project-updates.validators.js';
import { registerCase } from '../applications-case.locals.js';

const projectUpdatesRouter = createRouter({ mergeParams: true });

projectUpdatesRouter.use(registerCase);

projectUpdatesRouter.route('/').get(asyncRoute(controller.projectUpdatesTable));

projectUpdatesRouter
	.route('/create')
	.get(asyncRoute(controller.projectUpdatesCreateGet))
	.post(
		[validators.validateProjectUpdatesContent],
		asyncRoute(controller.projectUpdatesCreatePost)
	);

projectUpdatesRouter
	.route('/:projectUpdateId/status')
	.get(asyncRoute(controller.projectUpdatesTable));

projectUpdatesRouter
	.route('/:projectUpdateId/preview')
	.get(asyncRoute(controller.projectUpdatesTable));

projectUpdatesRouter
	.route('/:projectUpdateId/review')
	.get(asyncRoute(controller.projectUpdatesTable));

projectUpdatesRouter
	.route('/:projectUpdateId/delete')
	.get(asyncRoute(controller.projectUpdatesTable));

export default projectUpdatesRouter;
