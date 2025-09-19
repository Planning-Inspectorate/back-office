import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { unpublishRepresentationsErrorUrl } from '../config.js';
import { getUnpublishRepresentationsErrorController } from './unpublish-representations-error.controller.js';

const unpublishRepresentationsErrorRouter = createRouter({ mergeParams: true });

unpublishRepresentationsErrorRouter
	.route(`/${unpublishRepresentationsErrorUrl}`)
	.get(asyncHandler(getUnpublishRepresentationsErrorController));

export { unpublishRepresentationsErrorRouter };
