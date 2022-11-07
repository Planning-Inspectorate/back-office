import { Router as createRouter } from 'express';
import * as locals from '../../../applications.locals.js';
import * as controller from './applications-documentation.controller.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter
	.route('/')
	.get(controller.viewApplicationsCaseDocumentationCategories);

applicationsDocumentationRouter
	.route('/:folderId/:folders/upload')
	.get(controller.viewApplicationsCaseDocumentationUpload);

// TODO: this should be moved to a generic route valid for both appeals and applications
applicationsDocumentationRouter
	.route('/:folderId/upload')
	.post(controller.postApplicationsCaseDocumentationUpload);

export default applicationsDocumentationRouter;
