import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	getPublishValidRepsController,
	postPublishValidRepsController
} from './publish-valid-reps.controller.js';
import { publishAllValidRepsUrl } from '../config.js';

const publishValidRepresentationsRouter = createRouter({ mergeParams: true });

publishValidRepresentationsRouter
	.route(`/${publishAllValidRepsUrl}`)
	.get(asyncHandler(getPublishValidRepsController))
	.post(asyncHandler(postPublishValidRepsController));

export default publishValidRepresentationsRouter;
