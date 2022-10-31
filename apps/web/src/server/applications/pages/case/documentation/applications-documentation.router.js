import { Router as createRouter } from 'express';
import * as locals from '../../../applications.locals.js';
import * as controller from './applications-documentation.controller.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter
	.route('/')
	.get(controller.viewApplicationsCaseDocumentationCategories);

applicationsDocumentationRouter
	.route('/:categoryId/:folders/upload')
	.get(controller.viewApplicationsCaseDocumentationUpload);

export default applicationsDocumentationRouter;
