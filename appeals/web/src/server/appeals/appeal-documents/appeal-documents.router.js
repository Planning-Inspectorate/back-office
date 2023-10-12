import { Router as createRouter } from 'express';
import asyncRoute from '../../lib/async-route.js';
import * as controller from './appeal-documents.controller.js';
import { validateCaseFolderId, validateCaseDocumentId } from './appeal-documents.middleware.js';

const router = createRouter({ mergeParams: true });

router
	.route('/:folderId/upload/:documentId?')
	.get(validateCaseFolderId, validateCaseDocumentId, asyncRoute(controller.renderDocumentUpload));

export default router;
