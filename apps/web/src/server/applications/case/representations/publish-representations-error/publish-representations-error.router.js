import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { publishRepresentationsErrorUrl } from '../config.js';
import { getPublishRepresentationsErrorController } from './publish-representations-error.controller.js';

const publishRepresentationsErrorRouter = createRouter({ mergeParams: true });

publishRepresentationsErrorRouter
	.route(`/${publishRepresentationsErrorUrl}`)
	.get(asyncHandler(getPublishRepresentationsErrorController));

export { publishRepresentationsErrorRouter };
