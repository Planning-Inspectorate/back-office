import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-key-dates.controller.js';
import * as validators from './applications-key-dates.validators.js';

const applicationsKeyDateRouter = createRouter({ mergeParams: true });

applicationsKeyDateRouter.route('/').get(asyncHandler(controller.viewKeyDatesIndex));

applicationsKeyDateRouter
	.route('/:sectionName')
	.get(asyncHandler(controller.viewKeyDatesEditSection))
	.post(validators.validateKeyDates, asyncHandler(controller.updateKeyDatesSection));

export default applicationsKeyDateRouter;
