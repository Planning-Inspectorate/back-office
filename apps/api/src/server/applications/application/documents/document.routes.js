import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { trimUnexpectedRequestParameters } from '#middleware/trim-unexpected-request-parameters.js';
import { validateApplicationId } from '../application.validators.js';
import { validatePaginationParameters } from '#middleware/pagination-validation.js';
import { validateFolderId, validateFolderIds } from '../../documents/documents.validators.js';
import {
	deleteDocumentSoftly,
	getDocumentFolderPath,
	getDocumentProperties,
	getDocumentVersions,
	getReadyToPublishDocuments,
	createDocumentsOnCase,
	createDocumentVersionOnCase,
	publishDocuments,
	revertDocumentPublishedStatus,
	storeDocumentVersion,
	updateDocuments,
	getDocumentVersionProperties,
	markAsPublished,
	markAsUnpublished,
	unpublishDocuments,
	searchDocuments,
	getManyDocumentsProperties
} from './document.controller.js';
import {
	validateDocumentIds,
	validateDocumentsToUpdateProvided,
	validateDocumentsToUploadProvided,
	validateDocumentToUploadProvided,
	validateMarkDocumentAsPublished
} from './document.validators.js';

const router = createRouter();

router.post(
	'/:id/documents/:guid/metadata',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/metadata'
        #swagger.description = 'Create or update the document version metadata for a document'
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
            schema: { $ref: '#/definitions/DocumentVersionUpsertRequestBody' }
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
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
        #swagger.description = 'Saves new documents to database and returns document info and location in Blob Storage'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: { $ref: '#/definitions/DocumentsToSaveManyRequestBody' }
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Documents that have been saved',
            schema: { $ref: '#/definitions/DocumentAndBlobInfoManyResponse' }
        }
		#swagger.responses[206] = {
			description: 'Some documents failed to save while others succeeded',
			schema: { $ref: '#/definitions/DocumentsUploadPartialFailed' }
		}
		#swagger.responses[409] = {
			description: 'All documents failed to upload',
			schema: { $ref: '#/definitions/DocumentsUploadFailed' }
		}
	 */
	validateApplicationId,
	validateDocumentsToUploadProvided,
	validateFolderIds,
	trimUnexpectedRequestParameters,
	asyncHandler(createDocumentsOnCase)
);

router.patch(
	'/:id/documents/unpublish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/unpublish'
        #swagger.description = 'Unpublish a document by its GUID'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: { $ref: '#/definitions/DocumentsToUnpublishRequestBody' }
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Documents that have been unpublished',
            schema: { $ref: '#/definitions/DocumentsUnpublishResponseBody' }
        }
		#swagger.responses[206] = {
			description: 'Some documents failed to unpublish while others succeeded',
			schema: { $ref: '#/definitions/DocumentsUnpublishResponseBody' }
		}
		#swagger.responses[409] = {
			description: 'All documents failed to unpublish',
			schema: { $ref: '#/definitions/DocumentsUnpublishResponseBody' }
		}
  */
	validateApplicationId,
	validateDocumentsToUpdateProvided,
	validateDocumentIds,
	trimUnexpectedRequestParameters,
	asyncHandler(unpublishDocuments)
);

router.post(
	'/:id/document/:guid/add-version',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/document/{guid}/add-version'
        #swagger.description = 'Adds a new file version to an existing document, and returns document info and location in Blob Storage'
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
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Document Details',
            schema: { $ref: '#/definitions/DocumentToSave' }
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Document that has been saved',
            schema: { $ref: '#/definitions/DocumentAndBlobInfoResponse' }
        }
	 */
	validateApplicationId,
	validateDocumentToUploadProvided,
	validateFolderId,
	asyncHandler(createDocumentVersionOnCase)
);

router.patch(
	'/:id/documents',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents'
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
            schema: { $ref: '#/definitions/DocumentsToUpdateRequestBody' },
			required: true
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Documents that have been updated',
            schema: [ { guid: '0084b156-006b-48b1-a47f-e7176414db29', "status": "not_checked", "redactedStatus": "redacted" } ]
        }
		#swagger.responses[400] = {
            description: 'Example of an error response',
            schema: { errors: { id: "Must be an existing application" } }
        }
	 */
	validateApplicationId,
	validateDocumentsToUpdateProvided,
	validateDocumentIds,
	trimUnexpectedRequestParameters,
	asyncHandler(updateDocuments)
);

router.post(
	'/:id/documents/:guid/version/:version/mark-as-published',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/version/{version}/mark-as-published'
        #swagger.description = 'Completes publishing to mark as document as Published'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
		#swagger.parameters['guid'] = {
            in: 'path',
			description: 'Document GUID',
			required: true,
			type: 'string'
        }
		#swagger.parameters['version'] = {
            in: 'path',
			description: 'Version',
			required: true,
			type: 'integer'
        }
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Mark as Published Request',
            schema: { $ref: '#/definitions/DocumentMarkAsPublishedRequestBody' },
			required: true
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Updated document response',
            schema: { $ref: '#definitions/DocumentPropertiesWithVersionWithCase' }
        }
		#swagger.responses[400] = {
            description: 'Example of a missing body error response',
            schema: { $ref: '#/definitions/DocumentMarkAsPublishedBadRequest' }
        }
		#swagger.responses[404] = {
            description: 'Example of an error response',
            schema: { errors: { id: "Must be an existing application" } }
        }
	 */
	validateApplicationId,
	validateMarkDocumentAsPublished,
	asyncHandler(markAsPublished)
);

router.post(
	'/:id/documents/:guid/version/:version/mark-as-unpublished',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/version/{version}/mark-as-unpublished'
        #swagger.description = 'Completes unpublishing to mark as document as Unpublished'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
		#swagger.parameters['guid'] = {
            in: 'path',
			description: 'Document GUID',
			required: true,
			type: 'string'
        }
		#swagger.parameters['version'] = {
            in: 'path',
			description: 'Version',
			required: true,
			type: 'integer'
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Updated document response',
            schema: { $ref: '#definitions/DocumentPropertiesWithVersionWithCase' }
        }
		#swagger.responses[404] = {
            description: 'Example of an error response',
            schema: { errors: { id: "Must be an existing application" } }
        }
	 */
	validateApplicationId,
	asyncHandler(markAsUnpublished)
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
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Document properties',
            schema: { $ref: '#/definitions/DocumentProperties' }
        }
    */
	asyncHandler(getDocumentProperties)
);

router.get(
	'/documents/:guid/properties',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/documents/{guid}/properties'
        #swagger.description = 'Gets the properties of a single file'
        #swagger.parameters['guid'] = {
                in: 'path',
                description: 'guid of the required document here',
                required: true,
                type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Document properties',
            schema: { $ref: '#/definitions/DocumentProperties' }
        }
    */
	asyncHandler(getDocumentProperties)
);

router.get(
	'/:id/documents/properties',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/properties'
        #swagger.description = 'Gets the properties of the specified files'
		 #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['guids'] = {
			in: 'query',
			description: 'A list of guids',
			example: [1, 2],
		}
		#swagger.parameters['published'] = {
		in: 'query',
		description: 'Only return published documents',
		type: 'boolean',
		example: false
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Document properties',
            schema: { $ref: '#/definitions/DocumentProperties' }
        }
    */
	asyncHandler(getManyDocumentsProperties)
);

router.get(
	'/:id/documents/:guid/version/:version/properties',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents/{guid}/version/{version}/properties'
        #swagger.description = 'Gets the properties of a single file on a case by version id'
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
		#swagger.parameters['version'] = {
            in: 'path',
			description: 'version of the required document here',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Document properties',
            schema: { $ref: '#/definitions/DocumentProperties' }
        }
    */
	asyncHandler(getDocumentVersionProperties)
);

router.get(
	'/document/:guid/versions',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/document/{guid}/versions'
        #swagger.description = 'Gets the properties and all versions of a single file on a case'
		#swagger.parameters['guid'] = {
            in: 'path',
			description: 'guid of the required document here',
			required: true,
			type: 'string'
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Document properties',
            schema: { $ref: '#/definitions/DocumentPropertiesWithAllVersionWithAuditHistory' }
        }
    */
	asyncHandler(getDocumentVersions)
);

router.get(
	'/documents/:guid/path',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/documents/{guid}/path'
        #swagger.description = 'Gets the folder path of a document, as an array'
		#swagger.parameters['guid'] = {
            in: 'path',
			description: 'guid of the required document here',
			required: true,
			type: 'string'
		}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Array of folders which consitute the path the document is located in',
            schema: [ { id: 1, displayNameEn: 'Post-decision', displayOrder: 1100 } ]
        }
    */
	asyncHandler(getDocumentFolderPath)
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
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
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
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
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
        #swagger.description = 'Gets all documents that are ready to publish for the case'
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		},
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'document pagination parameters',
            schema: { $ref: '#/definitions/PaginationRequestBody' },
            required: true
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
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
            schema: { $ref: '#/definitions/DocumentsToPublishRequestBody' }
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
            description: 'Documents that have been published',
            schema: { $ref: '#/definitions/DocumentsPublished' }
        }
		#swagger.responses[400] = {
            description: 'Example of an error response',
            schema: { errors: { documents: "Unknown document guid 0084b156-006b-48b1-a47f-e7176414db29" } }
        }
	 */
	validateApplicationId,
	validateDocumentsToUpdateProvided,
	validateDocumentIds,
	asyncHandler(publishDocuments)
);

router.get(
	'/:id/documents',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/documents'
        #swagger.description = 'search documents on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
        }
		#swagger.parameters['page'] = {
			in: 'query',
			description: 'The page number to return, defaults to 1',
			example: 1,
			type: 'integer'
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The number of results per page, defaults to 25',
			example: 25,
			type: 'integer'
		}
      	#swagger.parameters['criteria'] = {
            in: 'query',
            description: 'search criteria',
			example: 'search string',
			type: 'string',
			required: true
    	}
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
        #swagger.responses[200] = {
			description: 'An paginated data set of matching documents and their properties',
            schema: { $ref: '#/definitions/PaginatedDocumentDetails' }
        }
		#swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
	 */
	validateApplicationId,
	validatePaginationParameters(),
	asyncHandler(searchDocuments)
);

export { router as documentRoutes };
