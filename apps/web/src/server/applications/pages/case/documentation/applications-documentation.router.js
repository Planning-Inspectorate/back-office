import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';
import * as locals from '../applications-case.locals.js';
import * as controller from './applications-documentation.controller.js';
import { validateApplicationsDocumentations } from './applications-documentation.validators.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter
	.route('/')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationCategories));

applicationsDocumentationRouter
	.route('/:folderId/:folderName')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseDocumentationFolder))
	.post(
		validateApplicationsDocumentations,
		asyncRoute(controller.updateApplicationsCaseDocumentationFolder)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folders/upload')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationUpload)
	);

export default applicationsDocumentationRouter;
