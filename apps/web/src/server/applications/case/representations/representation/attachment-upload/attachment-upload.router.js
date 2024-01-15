import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { repRoutes } from '../utils/get-representation-page-urls.js';
import { addRepresentationToLocals } from '../representation.middleware.js';
import { getRepresentationAttachmentUpload } from './attachment-upload.controller.js';

const relevantRepresentationAttachmentUploadRouter = createRouter({ mergeParams: true });

relevantRepresentationAttachmentUploadRouter
	.route(repRoutes.attachmentUpload)
	.get(addRepresentationToLocals, asyncHandler(getRepresentationAttachmentUpload));

export default relevantRepresentationAttachmentUploadRouter;
