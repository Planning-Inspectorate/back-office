import express from 'express';
import { downloadDocument, getAllDocuments, uploadDocument } from './controller.js';
import { asyncHandler } from './middleware/async-handler.js';
import { validateDocumentName,validateGetAllDocuments, validateUploadDocument } from './validator.js';

const router = new express.Router();

router.get('/', 
	/*
		#swagger.description = 'Lists all documents assigned to appeal/application'
		#swagger.parameters['id'] = {
			in: 'query',
			description: 'Appeal or application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['type'] = {
			in: 'query',
			description: 'Specifies if appeal or application',
			required: true,
			type: 'string',
			schema: { @enum: ['appeal', 'application'] }
		}
		#swagger.responses[200] = {
			description: 'List of documents associated with appeal/application and their metadata',
			schema: { $ref: '#/definitions/Documents' }
		}
	*/
	validateGetAllDocuments,
	asyncHandler(getAllDocuments));

router.get('/document',
	/*
		#swagger.description = 'Gets content of file'
		#swagger.parameters['documentName'] = {
			in: 'query',
			description: 'Full document name including path',
			required: true,
			type: 'string'
		}
		#swagger.responses[200] = {
			description: 'File content',
		}
	*/
	validateDocumentName,
	asyncHandler(downloadDocument));

router.post('/',
	/*
		#swagger.description = 'Uploads new document'
		#swagger.parameters['file'] = {
			in: 'formData',
			type: 'file',
			required: true,
			description: 'File to upload'
		}
		#swagger.parameters['documentType'] = {
			in: 'formData',
			type: 'string',
			required: true,
			description: 'Type of document which will be saved as metadata'
		},
		#swagger.parameters['type'] = {
			in: 'formData',
			description: 'Specifies if appeal or application',
			required: true,
			type: 'string',
			schema: { @enum: ['appeal', 'application'] }
		}
		#swagger.parameters['id'] = {
			in: 'formData',
			description: 'Appeal or application ID',
			required: true,
			type: 'integer'
		}
	*/
	validateUploadDocument,
	asyncHandler(uploadDocument));

export { router as documentsRouter };
