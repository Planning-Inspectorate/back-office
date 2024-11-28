import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as locals from '../applications-case.locals.js';
import * as controller from './applications-documentation.controller.js';
import {
	validateApplicationsDocumentations,
	validateApplicationsDocumentationsActions,
	validateApplicationsDocumentationsDeleteStatus,
	validateApplicationsDocumentationsFolders,
	validateApplicationsDocumentsToPublish,
	validateApplicationsDocumentsToUnpublish,
	validateApplicationsDocumentsToMove
} from './applications-documentation.validators.js';
import applicationsS51Router from '../s51/applications-s51.router.js';
import { assertFolderIsNotReps } from './applications-documentation.guard.js';

const applicationsDocumentationRouter = createRouter({ mergeParams: true });

applicationsDocumentationRouter.use('/:folderId/s51-advice', applicationsS51Router);

applicationsDocumentationRouter
	.route('/')
	.get(asyncHandler(controller.viewApplicationsCaseDocumentationCategories));

applicationsDocumentationRouter
	.route('/publishing-queue')
	.get(asyncHandler(controller.viewApplicationsCaseDocumentationPublishingQueue))
	.post(
		validateApplicationsDocumentsToPublish,
		asyncHandler(controller.updateApplicationsCaseDocumentationPublish)
	);

applicationsDocumentationRouter
	.route('/search-results')
	.get(asyncHandler(controller.viewApplicationsCaseDocumentationSearchPage))
	.post(asyncHandler(controller.viewApplicationsCaseDocumentationSearchPage));

applicationsDocumentationRouter
	.route('/:folderId/:folderName')
	.get(
		assertFolderIsNotReps,
		locals.registerFolder,
		asyncHandler(controller.viewApplicationsCaseDocumentationFolder)
	)
	.post(
		[
			validateApplicationsDocumentations,
			validateApplicationsDocumentationsActions,
			locals.registerFolder
		],
		asyncHandler(controller.updateApplicationsCaseDocumentationFolder)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folderName/unpublishing-queue')
	.post(
		[locals.registerDocumentGuid, validateApplicationsDocumentsToUnpublish, locals.registerFolder],
		asyncHandler(controller.viewApplicationsCaseDocumentationUnpublishPage)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/unpublish')
	.get(
		locals.registerDocumentGuid,
		asyncHandler(controller.viewApplicationsCaseDocumentationUnpublishSinglePage)
	)
	.post(locals.registerDocumentGuid, asyncHandler(controller.postUnpublishDocuments));

applicationsDocumentationRouter
	.route('/:folderId/:folders/upload')
	.get(locals.registerFolder, asyncHandler(controller.viewApplicationsCaseDocumentationUpload));

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/remove-from-publishing-queue')
	.get(
		[locals.registerFolder, locals.registerDocumentGuid],
		asyncHandler(controller.removeApplicationsCaseDocumentationPublishingQueue)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/delete')
	.post(
		[
			locals.registerFolder,
			locals.registerDocumentGuid,
			validateApplicationsDocumentationsDeleteStatus
		],
		asyncHandler(controller.updateApplicationsCaseDocumentationDelete)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/new-version')
	.get(
		[locals.registerFolder, locals.registerDocumentGuid],
		asyncHandler(controller.viewApplicationsCaseDocumentationVersionUpload)
	);

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/properties')
	.get(
		[locals.registerCase, locals.registerFolder, locals.registerDocumentGuid],
		asyncHandler(controller.viewApplicationsCaseDocumentationProperties)
	);

applicationsDocumentationRouter
	.route('/:folderId/:folderName/unpublish')
	.post([locals.registerFolder], asyncHandler(controller.postUnpublishDocuments));

applicationsDocumentationRouter
	.route('/:folderId/document/:documentGuid/:action')
	.get(
		[locals.registerFolder, locals.registerDocumentGuid],
		asyncHandler(controller.viewApplicationsCaseDocumentationPages)
	);

applicationsDocumentationRouter
	.route('/:folderId/folder/create')
	.get(asyncHandler(controller.viewFolderCreationPage))
	.post(validateApplicationsDocumentationsFolders, asyncHandler(controller.updateFolderCreate));

applicationsDocumentationRouter
	.route('/:folderId/folder/rename')
	.get(asyncHandler(controller.viewFolderRenamePage))
	.post(validateApplicationsDocumentationsFolders, asyncHandler(controller.updateFolderRename));

applicationsDocumentationRouter
	.route('/:folderId/folder/delete')
	.get(asyncHandler(controller.viewFolderDeletionPage))
	.post(asyncHandler(controller.updateFolderDelete));

applicationsDocumentationRouter
	.route('/:folderId/:folderName/move-documents')
	.post(
		[locals.registerFolder, validateApplicationsDocumentsToMove],
		asyncHandler(controller.viewApplicationsCaseDocumentationMove)
	);

export default applicationsDocumentationRouter;
