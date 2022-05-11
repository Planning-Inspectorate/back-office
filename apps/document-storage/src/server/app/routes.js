import express from 'express';
import { asyncHandler } from './middleware/async-handler.js';
import { validateDocumentUpload, validateGetAllDocuments, validateUploadDocument } from './validator.js';
import { getAllDocuments, uploadDocument } from './controller.js';

const router = express.Router();

router.get('/', 
	validateGetAllDocuments,
	asyncHandler(getAllDocuments));

router.post('/', 
	validateUploadDocument,
	validateDocumentUpload('file'), 
	asyncHandler(uploadDocument));

export { router as documentsRouter };
