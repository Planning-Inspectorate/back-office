import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
	getDocumentLocations,
	getDocument,
	getDocuments,
	addDocuments,
	addDocumentVersion
} from './documents.controller.js';

/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

const router = createRouter();

router.get(
	'/:appealId/documents',
	/*
		#swagger.tags = ['Appeal Documents']
		#swagger.path = '/appeals/{appealId}/documents'
		#swagger.description = Returns the contents of the appeal folders
		#swagger.responses[200] = {
			description: 'Gets all the documents for a specific appeal by id',
			schema: { $ref: '#/definitions/Folder' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(getDocuments)
);

router.get(
	'/:appealId/document-locations',
	/*
		#swagger.tags = ['Appeal Documents']
		#swagger.path = '/appeals/{appealId}/document-locations'
		#swagger.description = Returns the contents of the appeal folders
		#swagger.responses[200] = {
			description: 'Gets all the documents for a specific appeal by id',
			schema: { $ref: '#/definitions/Folder' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(getDocumentLocations)
);

router.get(
	'/:appealId/documents/:documentId',
	/*
		#swagger.tags = ['Appeal Documents']
		#swagger.path = '/appeals/{appealId}/documents/{documentId}'
		#swagger.description = Returns the contents of the appeal folders
		#swagger.responses[200] = {
			description: 'Gets all the documents for a specific appeal by id',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(getDocument)
);

router.post(
	'/:appealId/documents',
	/*
		#swagger.tags = ['Appeal Documents']
		#swagger.path = '/appeals/{appealId}/documents'
		#swagger.description = Upload documents to a case
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal documents to post',
			schema: { $ref: '#/definitions/DocumentDetails' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Gets all the documents for a specific appeal by id',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(addDocuments)
);

router.post(
	'/:appealId/documents/:documentId',
	/*
		#swagger.tags = ['Appeal Documents']
		#swagger.path = '/appeals/{appealId}/documents/:documentId'
		#swagger.description = Add a new version of a document
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal documents to post',
			schema: { $ref: '#/definitions/DocumentDetails' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Gets all the documents for a specific appeal by id',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(addDocumentVersion)
);

export { router as documentsRoutes };
