import { Router as createRouter } from 'express';
import * as locals from '../applications.locals.js';
import * as controller from './applications-summary.controller.js';

const applicationSummaryRouter = createRouter();

applicationSummaryRouter.param('applicationId', locals.loadApplication);

applicationSummaryRouter
	.route('/:applicationId/:pageType?')
	.get(controller.viewApplicationSummaryPages);

export default applicationSummaryRouter;
