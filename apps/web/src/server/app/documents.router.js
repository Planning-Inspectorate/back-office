import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { registerAdviceId, registerDownloadParams } from './app.locals.js';
import { registerCaseId } from '../applications/create-new-case/applications-create.locals.js';
import { registerDocumentGuid } from '../applications/case/applications-case.locals.js';
import {
	postDocumentsUpload,
	postProcessHTMLFile,
	postUploadDocumentVersion
} from './components/file-uploader.component.js';
import getDocumentsDownload from './components/file-downloader.component.js';

const documentsRouter = createRouter();

documentsRouter.route('/:caseId/upload').post(registerCaseId, asyncHandler(postDocumentsUpload));

documentsRouter
	.route('/:caseId/s51-advice/:adviceId/upload')
	.post([registerCaseId, registerAdviceId], asyncHandler(postDocumentsUpload));

documentsRouter
	.route('/:caseId/upload/:documentId/add-version')
	.post([registerCaseId, registerDocumentGuid], asyncHandler(postUploadDocumentVersion));

documentsRouter
	.route('/:caseId/download/:guid/version/:version/:preview?')
	.get([registerDownloadParams], asyncHandler(getDocumentsDownload));

documentsRouter.route('/process-html').post(asyncHandler(postProcessHTMLFile));

export default documentsRouter;
