import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './project-updates.controller.js';
import * as validators from './project-updates.validators.js';
import { registerCase } from '../applications-case.locals.js';

const projectUpdatesRouter = createRouter({ mergeParams: true });

projectUpdatesRouter.use(registerCase);

projectUpdatesRouter.route('/').get(asyncHandler(controller.projectUpdatesTable));

export const projectUpdateRoutes = Object.freeze({
	create: 'create',
	content: 'content',
	type: 'type',
	status: 'status',
	checkAnswers: 'check-answers',
	review: 'review',
	delete: 'delete'
});

projectUpdatesRouter
	.route(`/${projectUpdateRoutes.create}`)
	.get(asyncHandler(controller.projectUpdatesCreateGet))
	.post(
		[validators.validateProjectUpdatesContent],
		asyncHandler(controller.projectUpdatesCreatePost)
	);

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.content}`)
	.get(asyncHandler(controller.projectUpdatesContentGet))
	.post(
		[validators.validateProjectUpdatesContent],
		asyncHandler(controller.projectUpdatesContentPost)
	);

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.type}`)
	.get(asyncHandler(controller.projectUpdatesTypeGet))
	.post(asyncHandler(controller.projectUpdatesTypePost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.status}`)
	.get(asyncHandler(controller.projectUpdatesStatusGet))
	.post(asyncHandler(controller.projectUpdatesStatusPost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.checkAnswers}`)
	.get(asyncHandler(controller.projectUpdatesCheckAnswersGet))
	.post(asyncHandler(controller.projectUpdatesCheckAnswersPost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.review}`)
	.get(asyncHandler(controller.projectUpdatesReviewGet));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.delete}`)
	.get(asyncHandler(controller.projectUpdatesDeleteGet))
	.post(asyncHandler(controller.projectUpdatesDeletePost));

export default projectUpdatesRouter;
