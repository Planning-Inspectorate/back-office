import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { publishUpdatedRepresentationsRoute } from './publish-updated-representations.config.js';
import {
	getPublishUpdatedRepresentationsController,
	postPublishUpdatedRepresentationsController
} from './publish-updated-representations.controller.js';

const publishUpdatedRepresentationsRouter = createRouter({ mergeParams: true });

publishUpdatedRepresentationsRouter
	.route(`/${publishUpdatedRepresentationsRoute}`)
	.get(asyncRoute(getPublishUpdatedRepresentationsController))
	.post(asyncRoute(postPublishUpdatedRepresentationsController));

export { publishUpdatedRepresentationsRouter };
