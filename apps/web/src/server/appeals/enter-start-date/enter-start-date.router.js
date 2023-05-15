import { Router as createRouter } from 'express';
import * as controller from './enter-start-date.controller.js';
import * as validators from './enter-start-date.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getEnterStartDate)
	.post(validators.validateEnteredStartDate, controller.postEnterStartDate);

export default router;
