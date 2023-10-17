import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { getPublishValidRepsController, postPublishValidRepsController } from './publish-valid-reps.controller.js';

const publishValidRepresentationsRouter = createRouter({ mergeParams: true });

publishValidRepresentationsRouter
	.route('/publish-valid-representations')
	.get(asyncRoute(getPublishValidRepsController));

publishValidRepresentationsRouter
	.route('/publish-valid-representations')
	.post(asyncRoute(postPublishValidRepsController));

export default publishValidRepresentationsRouter;
