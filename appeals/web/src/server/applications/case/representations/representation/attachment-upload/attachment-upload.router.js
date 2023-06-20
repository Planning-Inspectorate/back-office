import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { getRepresentationAttachmentUpload } from './attachment-upload.controller.js';

const relevantRepresentationAttachmentUploadRouter = createRouter({ mergeParams: true });

relevantRepresentationAttachmentUploadRouter
	.route('/attachment-upload')
	.get(asyncRoute(getRepresentationAttachmentUpload));

export default relevantRepresentationAttachmentUploadRouter;
