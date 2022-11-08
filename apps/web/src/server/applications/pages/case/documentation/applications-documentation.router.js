import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as locals from '../../../applications.locals.js';
import * as controller from './applications-documentation.controller.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter
	.route('/')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationCategories));

export default applicationsDocumentationRouter;
