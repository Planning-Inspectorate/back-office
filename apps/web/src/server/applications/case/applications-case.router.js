import { Router as createRouter } from 'express';
import * as locals from '../applications.locals.js';
import * as controller from './applications-case.controller.js';

const applicationCaseRouter = createRouter();

applicationCaseRouter.param('applicationId', locals.loadApplication);

applicationCaseRouter.route('/:applicationId/:pageType?').get(controller.viewApplicationCasePages);

export default applicationCaseRouter;
