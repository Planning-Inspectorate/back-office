import { Router as createRouter } from 'express';
import { skipMiddlewareIfErrorsInRequest } from '../../lib/middleware/skip-middleware-if-errors-in-body.js';
import * as controller from './enter-start-date.controller.js';
import * as validators from './enter-start-date.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getEnterStartDate)
	.post(
		validators.validateStartDateFields,
		skipMiddlewareIfErrorsInRequest(validators.validateWholeStartDate),
		controller.postEnterStartDate
	);

export default router;
