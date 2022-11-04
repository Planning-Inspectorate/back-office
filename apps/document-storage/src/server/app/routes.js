import { Router as createRouter } from 'express';
import {
	documentLocation,
	downloadDocument,
	getAllDocuments,
	uploadDocument
} from './controller.js';
import { asyncHandler } from './middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from './middleware/trim-unexpected-request-parameters.js';
import {
	validateDocumentInfo,
	validateDocumentName,
	validateGetAllDocuments,
	validateUploadDocument
} from './validator.js';

const router = createRouter();

router.get(
	'/',
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
	asyncHandler(getAllDocuments)
);

router.get(
	'/document',
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
	asyncHandler(downloadDocument)
);

router.post(
	'/',
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
	asyncHandler(uploadDocument)
);

router.post(
	'/document-location',
	/*
		#swagger.tags = ['Document-Storage']
	    #swagger.path = '/document-location'
		#swagger.description = 'Creates doc url'
		#swagger.parameters['body'] = {
			in: 'body',
			type: 'Array',
			required: true,
			schema: { $ref: '#/definitions/createBlobUrl' },
			description: 'Array of objects containing information about documents to return formatted url' }
		#swagger.responses[200] = {
            description: 'ID of application',
            schema: [ { "caseType": "application", "caseReference": "1", "documentName": "PINS1", "GUID": "D987654321","blobStoreUrl": "/application/1/D987654321/PINS1" }
]
        }
	*/
	validateDocumentInfo,
	trimUnexpectedRequestParameters,
	asyncHandler(documentLocation)
);

export { router as documentsRouter };
