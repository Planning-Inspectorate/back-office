import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { getPublishValidRepsController } from './publish-valid-reps.controller.js';

const publishValidRepresentationsRouter = createRouter({ mergeParams: true });

publishValidRepresentationsRouter
	.route('/publish-valid-representations')
	.get(asyncRoute(getPublishValidRepsController));

export default publishValidRepresentationsRouter;
