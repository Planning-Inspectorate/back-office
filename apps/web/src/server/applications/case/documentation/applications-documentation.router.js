import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as locals from '../applications-case.locals.js';
import * as controller from './applications-documentation.controller.js';
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
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationPublishingQueue))
	.post(
		validateApplicationsDocumentsToPublish,
		asyncRoute(controller.updateApplicationsCaseDocumentationPublish)
	);

applicationsDocumentationRouter
	.route('/search-results')
	.get(asyncRoute(controller.viewApplicationsCaseDocumentationSearchPage))
	.post(asyncRoute(controller.viewApplicationsCaseDocumentationSearchPage));

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
	.get([locals.registerFolder], asyncRoute(controller.viewApplicationsCaseDocumentationUpload));

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/remove-from-publishing-queue')
	.get(
		[locals.registerFolder],
		asyncRoute(controller.removeApplicationsCaseDocumentationPublishingQueue)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/delete')
	.post(
		[locals.registerFolder, validateApplicationsDocumentationsDeleteStatus],
		asyncRoute(controller.updateApplicationsCaseDocumentationDelete)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/new-version')
	.get(
		[locals.registerFolder],
		asyncRoute(controller.viewApplicationsCaseDocumentationVersionUpload)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/properties')
	.get([locals.registerFolder], asyncRoute(controller.viewApplicationsCaseDocumentationProperties));

applicationsDocumentationRouter
	.route('/:folderId/:folderName/unpublish')
	.post([locals.registerFolder], asyncRoute(controller.postUnpublishDocuments));

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/:action')
	.get([locals.registerFolder], asyncRoute(controller.viewApplicationsCaseDocumentationPages));

export default applicationsDocumentationRouter;
