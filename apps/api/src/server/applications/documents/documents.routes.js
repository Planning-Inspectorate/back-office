import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../../middleware/trim-unexpected-request-parameters.js';
import { validateApplicationId } from '../application/application.validators.js';
import { provideDocumentUploadURLs } from './documents.controller.js';
import { validateDocumentsToUploadProvided, validateFolderIds } from './documents.validators.js';

const router = createRouter({ mergeParams: true });

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents'
        #swagger.description = 'Saves new documents to database and returns location in Blob Storage'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: { $ref: '#/definitions/documentsToSave' }
        }
        #swagger.responses[200] = {
            description: 'Documents that have been saved',
            schema: { $ref: '#/definitions/documentsAndBlobStorageURLs' }
        }
	 */
	validateApplicationId,
	validateDocumentsToUploadProvided,
	validateFolderIds,
	trimUnexpectedRequestParameters,
	asyncHandler(provideDocumentUploadURLs)
);

export { router as documentsRoutes };
