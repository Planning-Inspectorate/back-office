import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';
import * as locals from '../applications-case.locals.js';
import applicationsDocumentationMetadataRouter from '../documentation-metadata/documentation-metadata.router.js';
import * as controller from './applications-documentation.controller.js';
import {
	validateApplicationsDocumentations,
	validateApplicationsDocumentationsDeleteStatus
} from './applications-documentation.validators.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter
	.route('/')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationCategories));

applicationsDocumentationRouter
	.route('/:folderId/:folderName')
	.get(locals.registerFolder, asyncRoute(controller.viewApplicationsCaseDocumentationFolder))
	.post(
		[validateApplicationsDocumentations, locals.registerFolder],
		asyncRoute(controller.updateApplicationsCaseDocumentationFolder)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folders/upload')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationUpload)
	);

applicationsDocumentationRouter.use(
	'/:folderId/document/:documentGuid/edit',
	applicationsDocumentationMetadataRouter
);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/:action')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationPages)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/delete')
	.post(
		[
			assertDomainTypeIsNotInspector,
			locals.registerFolder,
			validateApplicationsDocumentationsDeleteStatus
		],
		asyncRoute(controller.updateApplicationsCaseDocumentationDelete)
	);

export default applicationsDocumentationRouter;
