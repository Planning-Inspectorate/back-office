import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { publishRepresentationsErrorUrl } from '../config.js';
import { getPublishRepresentationsErrorController } from './publish-representations-error.controller.js';

const publishRepresentationsErrorRouter = createRouter({ mergeParams: true });

publishRepresentationsErrorRouter
	.route(`/${publishRepresentationsErrorUrl}`)
	.get(asyncRoute(getPublishRepresentationsErrorController));

export { publishRepresentationsErrorRouter };
