import { Router as createRouter } from 'express';
import { asyncHandler } from '../../../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../../../middleware/trim-unexpected-request-parameters.js';
import { validateApplicationId } from '../../application/application.validators.js';
import { validateFolderIds } from '../../documents/documents.validators.js';
import { publishCase } from '../application.controller.js';
import {
	getDocumentProperties,
	provideDocumentUploadURLs,
	updateDocuments
} from './document.controller.js';
import {
	validateDocumentIds,
	validateDocumentsToUpdateProvided,
	validateDocumentsToUploadProvided
} from './document.validators.js';

const router = createRouter();

router.post(
	'/:id/documents',
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

router.patch(
	'/:id/documents/update',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/update'
        #swagger.description = 'Updates the status and/or redaction status on an array of documents'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Update Details',
            schema: { $ref: '#/definitions/documentsToUpdateRequestBody' },
			required: true
        }
        #swagger.responses[200] = {
            description: 'Documents that have been updated',
            schema: [ { guid: '0084b156-006b-48b1-a47f-e7176414db29' } ]
        }
	 */
	validateApplicationId,
	validateDocumentsToUpdateProvided,
	validateDocumentIds,
	trimUnexpectedRequestParameters,
	asyncHandler(updateDocuments)
);

router.get(
	'/:id/documents/:guid',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}'
        #swagger.description = 'Gets the properties of a single file on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['guid'] = {
            in: 'path',
			description: 'guid of the required document here',
			required: true,
			type: 'string'
		}
        #swagger.responses[200] = {
            description: 'Document properties',
            schema: { $ref: '#/definitions/DocumentDetails' }
        }
    */
	validateApplicationId,
	asyncHandler(getDocumentProperties)
);

router.patch(
	'/:id/publish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/publish'
        #swagger.description = 'publish application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'response will have the date that the case was published as a timestamp',
            schema: { publishedDate: 1673873105 }
        }
    */
	validateApplicationId,
	asyncHandler(publishCase)
);

export { router as documentRoutes };
