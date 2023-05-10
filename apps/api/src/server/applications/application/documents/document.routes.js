import { Router as createRouter } from 'express';
import { asyncHandler } from '../../../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../../../middleware/trim-unexpected-request-parameters.js';
import { validateApplicationId } from '../../application/application.validators.js';
import { validateFolderId, validateFolderIds } from '../../documents/documents.validators.js';
import {
	deleteDocumentSoftly,
	getDocumentProperties,
	getReadyToPublishDocuments,
	provideDocumentUploadURLs,
	provideDocumentVersionUploadURL,
	publishDocuments,
	revertDocumentPublishedStatus,
	storeDocumentVersion,
	updateDocuments
} from './document.controller.js';
import {
	validateDocumentIds,
	validateDocumentsToUpdateProvided,
	validateDocumentsToUploadProvided,
	validateDocumentToUploadProvided
} from './document.validators.js';

const router = createRouter();

router.post(
	'/:id/documents/:guid/metadata',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/metadata'
        #swagger.description = 'This endpoint enables the storage of metadata for a document linked to a particular case, whether it's newly created or updated.'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['guid'] = {
            in: 'path',
			description: 'guid of the required document here',
			required: true,
			type: 'string'
		}
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: { $ref: '#/definitions/documentsMetadataRequestBody' }
        }
		#swagger.responses[200] = {
			description: 'The metadata has been successfully stored.',
			schema: { $ref: '#/definitions/DocumentDetails' }
		}
    */
	asyncHandler(storeDocumentVersion)
);

router.post(
	'/:id/documents',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents'
        #swagger.description = 'Saves new documents to database and returns location in Blob Storage'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
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

router.post(
	'/:id/document/:documentId/version',
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
		#swagger.parameters['documentId'] = {
            in: 'path',
			description: 'Document ID here',
			required: true,
			type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: { $ref: '#/definitions/documentToSave' }
        }
        #swagger.responses[200] = {
            description: 'Document that have been saved',
            schema: { $ref: '#/definitions/documentsAndBlobStorageURLs' }
        }
	 */
	validateApplicationId,
	validateDocumentToUploadProvided,
	validateFolderId,
	trimUnexpectedRequestParameters,
	asyncHandler(provideDocumentVersionUploadURL)
);

router.patch(
	'/:id/documents/update',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/update'
        #swagger.description = 'Updates the status and/or redaction status on an array of documents'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
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
	'/:id/documents/:guid/properties',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/properties'
        #swagger.description = 'Gets the properties of a single file on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
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
            schema: { $ref: '#/definitions/documentsPropertiesRequestBody' }
        }
    */
	asyncHandler(getDocumentProperties)
);

router.post(
	'/:id/documents/:guid/revert-published-status',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/revert-published-status'
        #swagger.description = 'Reverts the published status of a document to the previous status'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['guid'] = {
            in: 'path',
			description: 'guid of the document',
			required: true,
			type: 'string'
		}
        #swagger.responses[200] = {
            description: 'OK'
        }
    */
	validateApplicationId,
	asyncHandler(revertDocumentPublishedStatus)
);

router.post(
	'/:id/documents/:guid/delete',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/delete'
        #swagger.description = 'Deletes a document associated with a specific application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
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
			description: 'The document has been successfully soft-deleted and is no longer accessible.',
			schema: {
				type: 'object',
				properties: {
					isDeleted: {
						type: 'boolean',
						description: 'Indicates whether the document has been successfully soft-deleted.'
					}
				}
			}
		}
    */
	asyncHandler(deleteDocumentSoftly)
);

router.post(
	'/:id/documents/ready-to-publish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/ready-to-publish'
        #swagger.description = 'Gets all documents that are ready to publish'
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		},
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'document pagination parameters',
            schema: { $ref: '#/definitions/DocumentsInCriteriaRequestBody' },
            required: true
        }
		#swagger.responses[200] = {
            description: 'An paginated data set of documents and their properties',
            schema: { $ref: '#/definitions/PaginatedDocumentDetails' }
        }
    */
	asyncHandler(getReadyToPublishDocuments)
);

router.patch(
	'/:id/documents/publish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/publish'
        #swagger.description = 'Publishes the documents selected from the Ready to Publish queue'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Array of document guids to publish',
            schema: { $ref: '#/definitions/documentsToPublishRequestBody' }
        }
        #swagger.responses[200] = {
            description: 'Documents that have been published',
            schema: { $ref: '#/definitions/documentsPublished' }
        }
	 */
	validateApplicationId,
	validateDocumentsToUpdateProvided,
	validateDocumentIds,
	trimUnexpectedRequestParameters,
	asyncHandler(publishDocuments)
);

export { router as documentRoutes };
