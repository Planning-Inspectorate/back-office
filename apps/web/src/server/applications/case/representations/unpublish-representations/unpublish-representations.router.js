import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	getUnpublishRepresentationsController,
	postUnpublishRepresentationsController
} from './unpublish-representations.controller.js';
import { unpublishRepsUrl } from '../config.js';

const unpublishRepresentationsRouter = createRouter({ mergeParams: true });

unpublishRepresentationsRouter
	.route(`/${unpublishRepsUrl}`)
	.get(asyncHandler(getUnpublishRepresentationsController))
	.post(asyncHandler(postUnpublishRepresentationsController));

export default unpublishRepresentationsRouter;
