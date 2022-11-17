import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as locals from '../applications-case.locals.js';
import * as controller from './applications-documentation.controller.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter
	.route('/')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationCategories));

applicationsDocumentationRouter
	.route('/:folderId/:folderName')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseDocumentationFolder));

applicationsDocumentationRouter
	.route('/:folderId/:folders/upload')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseDocumentationUpload));

export default applicationsDocumentationRouter;
