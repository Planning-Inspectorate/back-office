import { Router as createRouter } from 'express';
import * as controller from './appellant-case.controller.js';
import * as validators from './appellant-case.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getAppellantCase)
	.post(validators.validateReviewOutcome, controller.postAppellantCase);

export default router;
