import express from 'express';
import { downloadDocument, getAllDocuments, uploadDocument } from './controller.js';
import { asyncHandler } from './middleware/async-handler.js';
import { validateDocumentName,validateGetAllDocuments, validateUploadDocument } from './validator.js';

const router = new express.Router();

router.get('/', 
	validateGetAllDocuments,
	asyncHandler(getAllDocuments));

router.get('/document',
	validateDocumentName,
	asyncHandler(downloadDocument));

router.post('/', 
	validateUploadDocument,
	asyncHandler(uploadDocument));

export { router as documentsRouter };
