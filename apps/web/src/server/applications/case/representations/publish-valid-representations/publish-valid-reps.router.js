import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { getPublishValidRepsController, postPublishValidRepsController } from './publish-valid-reps.controller.js';
import { publishQueueUrl } from '../config.js';


const publishValidRepresentationsRouter = createRouter({ mergeParams: true });

publishValidRepresentationsRouter
	.route(`/${publishQueueUrl}`)
	.get(asyncRoute(getPublishValidRepsController))
	.post(asyncRoute(postPublishValidRepsController))

export default publishValidRepresentationsRouter;
