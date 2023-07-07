import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { getAppealValidator } from '#endpoints/appeals/appeals.validators.js';
import { checkAppealExistsAndAddToRequest } from '#endpoints/appeals/appeals.service.js';
import { validateDocumentAndAddToRequest } from './documents.middleware.js';
import * as controller from './documents.controller.js';

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
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	asyncHandler(controller.getDocuments)
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
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	asyncHandler(controller.getDocumentLocations)
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
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	validateDocumentAndAddToRequest,
	asyncHandler(controller.getDocument)
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
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	asyncHandler(controller.addDocuments)
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
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	validateDocumentAndAddToRequest,
	asyncHandler(controller.addDocumentVersion)
);

export { router as documentsRoutes };
