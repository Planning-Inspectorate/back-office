import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	createS51Advice,
	getS51Advice,
	getManyS51Advices,
	addDocuments,
	getDocuments,
	updateManyS51Advices,
	updateS51Advice,
	getReadyToPublishAdvices,
	verifyS51TitleIsUnique,
	removePublishItemFromQueue,
	publishQueueItems,
	deleteS51Advice,
	unpublishS51Advice
} from './s51-advice.controller.js';
import {
	validateCreateS51Advice,
	validatePaginationCriteria,
	validateS51AdviceIds,
	validateS51AdviceToUpdateProvided,
	validateS51AdviceId,
	validateS51AdviceIsNotPublished
} from './s51-advice.validators.js';
import { validateApplicationId } from '../application/application.validators.js';
import { trimUnexpectedRequestParameters } from '#middleware/trim-unexpected-request-parameters.js';

const router = createRouter();

router.post(
	'/s51-advice',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/s51-advice'
        #swagger.description = 'Create an S51 advice for the case'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Payload to create S51 advice',
            schema: { $ref: '#/definitions/S51AdviceCreateRequestBody' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Created S51 advice',
            schema: { $ref: '#/definitions/S51AdviceDetailsWithCaseId' }
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
    */
	validateCreateS51Advice,
	asyncHandler(createS51Advice)
);

router.get(
	'/:id/s51-advice/:adviceId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/{adviceId}'
        #swagger.description = 'Gets an S51 Advice record'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['adviceId'] = {
            in: 'path',
			description: 'S51 advice ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'An S51 Advice on a case',
            schema: { $ref: '#/definitions/S51AdviceDetailsWithDocumentDetails' }
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
    */
	validateApplicationId,
	asyncHandler(getS51Advice)
);

router.get(
	'/:id/s51-advice',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice'
        #swagger.description = 'Gets paginated array of undeleted S51 Advice(s) on a case'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Application ID',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'The page number required',
            required: true,
            type: 'number'
        }
        #swagger.parameters['pageSize'] = {
            in: 'query',
            description: 'The number of items per page',
            required: true,
            type: 'number'
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
            description: 'A paginated data set of S51 Advices and their properties',
            schema: { $ref: '#/definitions/S51AdvicePaginatedResponse' }
        }
		#swagger.responses[400] = {
            description: 'Error: Bad Request',
            schema: { $ref: '#/definitions/S51AdvicePaginatedBadRequest' }
        }
		#swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
    */
	validateApplicationId,
	validatePaginationCriteria,
	asyncHandler(getManyS51Advices)
);

router.post(
	'/:id/s51-advice/:adviceId/documents',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/{adviceId}/documents'
        #swagger.description = 'Add S51 advice documents'
         #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['adviceId'] = {
            in: 'path',
			description: 'S51 advice ID',
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
            description: 'S51 Documents that have been saved',
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
	asyncHandler(addDocuments)
);

router.get(
	'/:id/s51-advice/:adviceId/documents',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/{adviceId}/documents'
        #swagger.description = 'Get S51 advice documents for an S51 Advice record'
         #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['adviceId'] = {
            in: 'path',
			description: 'S51 advice ID',
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
            description: 'S51 Documents',
            schema: { $ref: '#/definitions/DocumentAndBlobInfoManyResponse' }
        }
    */
	validateApplicationId,
	asyncHandler(getDocuments)
);

router.patch(
	'/:id/s51-advice',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice'
        #swagger.description = 'Updates redacted status and / or published status for an array of S51 Advice(s) on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'S51 Advice update parameters',
			schema: { $ref: '#/definitions/S51AdviceMultipleUpdateRequestBody' },
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
            description: 'S51 Advice(s) that have been updated',
            schema: { $ref: '#/definitions/S51AdviceMultipleUpdateResponseBody' }
        }
		#swagger.responses[400] = {
            description: 'Error: Bad Request',
            schema: { $ref: '#/definitions/S51AdviceUpdateBadRequest' }
        }
		#swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
    */
	validateApplicationId,
	validateS51AdviceToUpdateProvided,
	validateS51AdviceIds,
	trimUnexpectedRequestParameters,
	asyncHandler(updateManyS51Advices)
);

router.patch(
	'/:id/s51-advice/:adviceId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/{adviceId}'
        #swagger.description = 'Updates redacted status and / or published status for a single S51 Advice on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['adviceId'] = {
            in: 'path',
            description: 'Advice ID',
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
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'S51 Advice update parameters',
			schema: { $ref: '#/definitions/S51AdviceUpdateRequestBody' },
			required: true
		}
        #swagger.responses[200] = {
            description: 'The updated S51 Advice record',
            schema: { $ref: '#/definitions/S51AdviceDetailsWithCaseId' }
        }
      	#swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
    */
	validateApplicationId,
	validateS51AdviceToUpdateProvided,
	validateS51AdviceId,
	trimUnexpectedRequestParameters,
	asyncHandler(updateS51Advice)
);

router.delete(
	'/:id/s51-advice/:adviceId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/{adviceId}'
        #swagger.description = 'Soft-deletes an S51 Advice by id, and any associated S51 Advice documents'
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['adviceId'] = {
            in: 'path',
			description: 'S51 Advice ID',
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
            description: 'S51 Advice successfully soft-deleted',
            schema: { $ref: '#/definitions/S51AdviceDetailsWithCaseId' }
        }
		#swagger.responses[400] = {
            description: 'S51 Advice successfully soft-deleted',
            schema: { "errors": { "adviceId": "You must first unpublish S51 advice before deleting it."  } }
        }
		#swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
    */
	validateApplicationId,
	validateS51AdviceId,
	validateS51AdviceIsNotPublished,
	asyncHandler(deleteS51Advice)
);

router.post(
	'/:id/s51-advice/ready-to-publish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/ready-to-publish'
        #swagger.description = 'Gets all S51 that are ready to publish for the case'
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		},
		#swagger.parameters['body'] = {
            in: 'body',
            description: 's51 pagination parameters',
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
            description: 'An paginated data set of s51 advices and their properties',
            schema: { $ref: '#/definitions/S51AdvicePaginatedResponseWithDocumentDetails' }
        }
    */
	asyncHandler(getReadyToPublishAdvices)
);

router.post(
	'/:id/s51-advice/remove-queue-item',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/remove-queue-item'
        #swagger.description = 'Removes an S51 Advice item from the publishing queue'
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'S51 Advice Id',
            schema: { adviceId: 1 },
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
            description: 'Updated S51 Advice record',
            schema: { $ref: '#/definitions/S51AdviceDetailsWithCaseId' }
        }
    */
	asyncHandler(removePublishItemFromQueue)
);

router.head(
	'/:id/s51-advice/title-unique/:title',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/title-unique/{title}'
        #swagger.description = 'Checks whether an S51 title is unique to this case'
         #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['title'] = {
            in: 'path',
			description: 'S51 Title',
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
            description: 'valid unique S51 Advice title',
            schema: null
        }
		#swagger.responses[400] = {
            description: 'Error: Bad Request - title is not unique',
            schema: null
        }
		#swagger.responses[404] = {
            description: 'Error: Not Found - invalid case id',
			schema: null
        }

    */
	validateApplicationId,
	asyncHandler(verifyS51TitleIsUnique)
);

router.post(
	'/:id/s51-advice/publish-queue-items',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/publish-queue-items'
        #swagger.description = 'Publishes a list of items from the publish queue'
		#swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Payload to publish items',
			schema: { $ref: '#/definitions/S51AdvicePublishRequestBody' },
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
		description: 'Array of all updated S51 Advice records',
		schema: { $ref: '#/definitions/S51AdviceDetailsArrayWithCaseId' }
    }
    */
	asyncHandler(publishQueueItems)
);

router.patch(
	'/:id/s51-advice/:adviceId/unpublish',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/{adviceId}/unpublish'
        #swagger.description = 'Unpublish s51 advice'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['adviceId'] = {
            in: 'path',
            description: 'Advice ID',
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
            description: 'Unpublished S51 Advice record',
            schema: { $ref: '#/definitions/S51AdviceDetailsWithCaseId' }
        }
      	#swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
    */
	validateApplicationId,
	validateS51AdviceToUpdateProvided,
	validateS51AdviceId,
	trimUnexpectedRequestParameters,
	asyncHandler(unpublishS51Advice)
);

export { router as s51AdviceRoutes };
