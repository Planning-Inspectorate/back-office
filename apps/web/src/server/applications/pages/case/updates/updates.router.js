import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as locals from '../applications-case.locals.js';
import * as controller from './updates.controller.js';

const applicationsUpdatesRouter = createRouter({ mergeParams: true });

applicationsUpdatesRouter.use(locals.registerCase);

applicationsUpdatesRouter.route('/').get(asyncRoute(controller.viewCaseUpdates));

export default applicationsUpdatesRouter;
