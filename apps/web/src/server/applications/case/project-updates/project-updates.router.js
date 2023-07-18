import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './project-updates.controller.js';
import * as validators from './project-updates.validators.js';
import { registerCase } from '../applications-case.locals.js';

const projectUpdatesRouter = createRouter({ mergeParams: true });

projectUpdatesRouter.use(registerCase);

projectUpdatesRouter.route('/').get(asyncRoute(controller.projectUpdatesTable));

export const projectUpdateRoutes = Object.freeze({
	create: 'create',
	content: 'content',
	status: 'status',
	checkAnswers: 'check-answers',
	review: 'review',
	delete: 'delete'
});

projectUpdatesRouter
	.route(`/${projectUpdateRoutes.create}`)
	.get(asyncRoute(controller.projectUpdatesCreateGet))
	.post(
		[validators.validateProjectUpdatesContent],
		asyncRoute(controller.projectUpdatesCreatePost)
	);

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.content}`)
	.get(asyncRoute(controller.projectUpdatesContentGet))
	.post(
		[validators.validateProjectUpdatesContent],
		asyncRoute(controller.projectUpdatesContentPost)
	);

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.status}`)
	.get(asyncRoute(controller.projectUpdatesStatusGet))
	.post(asyncRoute(controller.projectUpdatesStatusPost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.checkAnswers}`)
	.get(asyncRoute(controller.projectUpdatesCheckAnswersGet))
	.post(asyncRoute(controller.projectUpdatesCheckAnswersPost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.review}`)
	.get(asyncRoute(controller.projectUpdatesTable));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.delete}`)
	.get(asyncRoute(controller.projectUpdatesTable));

export default projectUpdatesRouter;
