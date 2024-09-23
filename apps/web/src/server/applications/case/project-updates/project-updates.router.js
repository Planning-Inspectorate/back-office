import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './project-updates.controller.js';
import * as validators from './project-updates.validators.js';
import { registerProjectUpdateId } from './project-updates.locals.js';

const projectUpdatesRouter = createRouter({ mergeParams: true });

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
		[validators.validateProjectUpdatesContent, validators.validateProjectUpdatesContentWelsh],
		asyncHandler(controller.projectUpdatesCreatePost)
	);

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.content}`)
	.get(registerProjectUpdateId, asyncHandler(controller.projectUpdatesContentGet))
	.post(
		registerProjectUpdateId,
		validators.validateProjectUpdatesContent,
		validators.validateProjectUpdatesContentWelsh,
		asyncHandler(controller.projectUpdatesContentPost)
	);

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.type}`)
	.get(registerProjectUpdateId, asyncHandler(controller.projectUpdatesTypeGet))
	.post(registerProjectUpdateId, asyncHandler(controller.projectUpdatesTypePost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.status}`)
	.get(registerProjectUpdateId, asyncHandler(controller.projectUpdatesStatusGet))
	.post(registerProjectUpdateId, asyncHandler(controller.projectUpdatesStatusPost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.checkAnswers}`)
	.get(registerProjectUpdateId, asyncHandler(controller.projectUpdatesCheckAnswersGet))
	.post(registerProjectUpdateId, asyncHandler(controller.projectUpdatesCheckAnswersPost));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.review}`)
	.get(registerProjectUpdateId, asyncHandler(controller.projectUpdatesReviewGet));

projectUpdatesRouter
	.route(`/:projectUpdateId/${projectUpdateRoutes.delete}`)
	.get(registerProjectUpdateId, asyncHandler(controller.projectUpdatesDeleteGet))
	.post(registerProjectUpdateId, asyncHandler(controller.projectUpdatesDeletePost));

export default projectUpdatesRouter;
