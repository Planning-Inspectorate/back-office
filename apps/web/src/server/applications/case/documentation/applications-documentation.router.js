import { assertDomainTypeIsNotInspector } from '@pins/applications.web/src/server/applications/create-new-case/applications-create.guards.js';
import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as locals from '../applications-case.locals.js';
import * as controller from './applications-documentation.controller.js';
import * as validators from './applications-documentation.validators.js';

import {
	validateApplicationsDocumentations,
	validateApplicationsDocumentationsActions,
	validateApplicationsDocumentationsDeleteStatus,
	validateApplicationsDocumentsToPublish,
	validateApplicationsDocumentsToUnpublish
} from './applications-documentation.validators.js';
import applicationsS51Router from '../s51/applications-s51.router.js';
import { assertFolderIsNotReps } from './applications-documentation.guard.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

// TODO: make sure this is used only by the routes that require it
applicationsDocumentationRouter.use(locals.registerCase);

applicationsDocumentationRouter.use('/:folderId/s51-advice', applicationsS51Router);

applicationsDocumentationRouter
	.route('/')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationCategories));

applicationsDocumentationRouter
	.route('/publishing-queue')
	.get(
		[assertDomainTypeIsNotInspector],
		asyncRoute(controller.viewApplicationsCaseDocumentationPublishingQueue)
	)
	.post(
		[assertDomainTypeIsNotInspector],
		validateApplicationsDocumentsToPublish,
		asyncRoute(controller.updateApplicationsCaseDocumentationPublish)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folderName')
	.get(
		assertFolderIsNotReps,
		locals.registerFolder,
		asyncRoute(controller.viewApplicationsCaseDocumentationFolder)
	)
	.post(
		[
			validateApplicationsDocumentations,
			validateApplicationsDocumentationsActions,
			locals.registerFolder
		],
		asyncRoute(controller.updateApplicationsCaseDocumentationFolder)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folderName/unpublishing-queue')
	.post(
		[validateApplicationsDocumentsToUnpublish, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationUnpublishPage)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/unpublish')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationUnpublishSinglePage))
	.post(asyncRoute(controller.postUnpublishDocuments));

applicationsDocumentationRouter
	.route('/:folderId/:folders/upload')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationUpload)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/remove-from-publishing-queue')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.removeApplicationsCaseDocumentationPublishingQueue)
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

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/new-version')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationVersionUpload)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/properties')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationProperties)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folderName/unpublish')
	.post(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.postUnpublishDocuments)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/:action')
	.get(
		[assertDomainTypeIsNotInspector, locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationPages)
	);

console.log('hello call 1');
applicationsDocumentationRouter
	.route('/document-search-results/:pageNumber?')
	.get(asyncRoute(controller.searchDocuments))
	.post(validators.validateSearchApplicationsTerm, asyncRoute(controller.searchDocuments));

export default applicationsDocumentationRouter;
