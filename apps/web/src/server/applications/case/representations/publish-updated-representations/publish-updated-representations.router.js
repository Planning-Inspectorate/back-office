import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { publishUpdatedRepresentationsRoute } from './publish-updated-representations.config.js';
import {
	getPublishUpdatedRepresentationsController,
	postPublishUpdatedRepresentationsController
} from './publish-updated-representations.controller.js';
import { publishUpdatedRepresentationsValidation } from './publish-updated-representations.controller.validators.js';

const publishUpdatedRepresentationsRouter = createRouter({ mergeParams: true });

publishUpdatedRepresentationsRouter
	.route(`/${publishUpdatedRepresentationsRoute}`)
	.get(asyncHandler(getPublishUpdatedRepresentationsController))
	.post(
		publishUpdatedRepresentationsValidation,
		asyncHandler(postPublishUpdatedRepresentationsController)
	);

export { publishUpdatedRepresentationsRouter };
