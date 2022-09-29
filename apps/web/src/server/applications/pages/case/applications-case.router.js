import { Router as createRouter } from 'express';
import * as locals from '../../applications.locals.js';
import * as controller from './applications-case.controller.js';

const applicationsCaseRouter = createRouter();

applicationsCaseRouter.param('applicationId', locals.loadApplication);

applicationsCaseRouter
	.route('/:applicationId/:pageType?')
	.get(controller.viewApplicationsCasePages);

export default applicationsCaseRouter;
