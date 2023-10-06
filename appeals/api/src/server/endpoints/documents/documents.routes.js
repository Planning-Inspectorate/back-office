import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { getAppealValidator } from '#endpoints/appeals/appeals.validators.js';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import { validateDocumentAndAddToRequest } from './documents.middleware.js';
import {
	getFolderIdValidator,
	getDocumentIdValidator,
	getDocumentValidator,
	getDocumentsValidator,
	patchDocumentsValidator
} from './documents.validators.js';
import * as controller from './documents.controller.js';

const router = createRouter();

router.get(
	'/:appealId/document-folders/:folderId',
	/*
		#swagger.tags = ['Documents']
		#swagger.path = '/appeals/{appealId}/document-folders/{folderId}'
		#swagger.description = Returns the contents of a single appeal folder, by id
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Returns the contents of a single appeal folder, by id',
			schema: { $ref: '#/definitions/Folder' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	getFolderIdValidator,
	asyncHandler(controller.getFolder)
);

router.get(
	'/:appealId/documents/:documentId',
	/*
		#swagger.tags = ['Documents']
		#swagger.path = '/appeals/{appealId}/documents/{documentId}'
		#swagger.description = Returns a single document by id
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Returns a single document by id',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	getDocumentIdValidator,
	validateDocumentAndAddToRequest,
	asyncHandler(controller.getDocument)
);

router.post(
	'/:appealId/documents',
	/*
		#swagger.tags = ['Documents']
		#swagger.path = '/appeals/{appealId}/documents'
		#swagger.description = Upload documents to a case
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal documents to post',
			schema: { $ref: '#/definitions/DocumentDetails' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Document metadata successfully added',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	getDocumentsValidator,
	asyncHandler(controller.addDocuments)
);

router.post(
	'/:appealId/documents/:documentId',
	/*
		#swagger.tags = ['Documents']
		#swagger.path = '/appeals/{appealId}/documents/{documentId}'
		#swagger.description = Add a new version of a document
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal documents to post',
			schema: { $ref: '#/definitions/DocumentDetails' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Document metadata successfully added',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	getDocumentIdValidator,
	validateDocumentAndAddToRequest,
	getDocumentValidator,
	asyncHandler(controller.addDocumentVersion)
);

router.patch(
	'/:appealId/documents',
	/*
		#swagger.tags = ['Documents']
		#swagger.path = '/appeals/{appealId}/documents'
		#swagger.description = Updates multiple documents
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Documents to update',
			schema: { $ref: '#/definitions/UpdateDocumentsRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Documents to update',
			schema: { $ref: '#/definitions/UpdateDocumentsResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	patchDocumentsValidator,
	checkAppealExistsAndAddToRequest,
	asyncHandler(controller.updateDocuments)
);

export { router as documentsRoutes };
