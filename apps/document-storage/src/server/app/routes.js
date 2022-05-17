import express from 'express';
import { asyncHandler } from './middleware/async-handler.js';
import { validateDocumentUpload, validateGetAllDocuments, validateUploadDocument, validateDocumentName } from './validator.js';
import { downloadDocument, getAllDocuments, uploadDocument } from './controller.js';

const router = express.Router();

router.get('/', 
	validateGetAllDocuments,
	asyncHandler(getAllDocuments));

router.get('/document',
	validateDocumentName,
	asyncHandler(downloadDocument));

router.post('/', 
	validateUploadDocument,
	validateDocumentUpload('file'), 
	asyncHandler(uploadDocument));

export { router as documentsRouter };
