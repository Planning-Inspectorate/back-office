import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { repRoutes } from '../utils/get-representation-page-urls.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationAttachmentUpload } from './attachment-upload.controller.js';

const relevantRepresentationAttachmentUploadRouter = createRouter({ mergeParams: true });

relevantRepresentationAttachmentUploadRouter
	.route(repRoutes.attachmentUpload)
	.get(addRepresentationToLocals, asyncRoute(getRepresentationAttachmentUpload));

export default relevantRepresentationAttachmentUploadRouter;
