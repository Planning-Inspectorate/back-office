import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import {
	getPublishValidRepsController,
	postPublishValidRepsController
} from './publish-valid-reps.controller.js';
import { publishAllValidRepsUrl } from '../config.js';

const publishValidRepresentationsRouter = createRouter({ mergeParams: true });

publishValidRepresentationsRouter
	.route(`/${publishAllValidRepsUrl}`)
	.get(asyncRoute(getPublishValidRepsController))
	.post(asyncRoute(postPublishValidRepsController));

export default publishValidRepresentationsRouter;
