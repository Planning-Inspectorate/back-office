import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './project-updates.controller.js';
import { registerCase } from '../applications-case.locals.js';
const projectUpdatesRouter = createRouter({ mergeParams: true });

projectUpdatesRouter.route('/').get(registerCase, asyncRoute(controller.projectUpdatesPage));

export default projectUpdatesRouter;
