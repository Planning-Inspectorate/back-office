import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import {
	createS51Advice,
	getS51Advice,
	getManyS51Advices,
	addDocuments,
	getDocuments,
	updateManyS51Advices,
	updateS51Advice,
	getReadyToPublishAdvices
} from './s51-advice.controller.js';
import {
	validateCreateS51Advice,
	validatePaginationCriteria,
	validateS51AdviceIds,
	validateS51AdviceToUpdateProvided,
	validateS51AdviceId
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
            schema: { $ref: '#/definitions/S51AdviceCreateResponseBody' }
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
            description: 'List of examination timetable items',
            schema: { $ref: '#/definitions/S51AdviceResponseBody' }
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
        #swagger.description = 'Gets paginated array of S51 Advice(s) on a case'
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
            schema: { $ref: '#/definitions/documentsToSave' }
        }
        #swagger.responses[200] = {
            description: 'S51 Documents that have been saved',
            schema: { $ref: '#/definitions/documentsAndBlobStorageURLs' }
        }
		#swagger.responses[206] = {
			description: 'Some documents failed to save while others succeeded',
			schema: { $ref: '#/definitions/partialDocumentsAndBlobStorageURLs' }
		}
		#swagger.responses[409] = {
			description: 'All documents failed to upload',
			schema: { $ref: '#/definitions/documentsUploadFailed' }
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
        #swagger.description = 'Get S51 advice documents'
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
            description: 'S51 Documents',
            schema: { $ref: '#/definitions/documentsAndBlobStorageURLs' }
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
        #swagger.responses[200] = {
            description: 'S51 Advice(s) that have been updated',
            schema: { $ref: '#/definitions/S51AdviceUpdateResponseBody' }
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
        #swagger.path = '/applications/{id}/s51-advice'
        #swagger.description = 'Updates redacted status and / or published status for an array of S51 Advice(s) on a case'
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
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'S51 Advice update parameters',
			schema: { $ref: '#/definitions/S51AdviceUpdateRequestBody' },
			required: true
		}
        #swagger.responses[200] = {
            description: 'S51 Advice(s) that have been updated',
            schema: { $ref: '#/definitions/S51AdviceCreateResponseBody' }
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
            schema: { $ref: '#/definitions/DocumentsInCriteriaRequestBody' },
            required: true
        }
		#swagger.responses[200] = {
            description: 'An paginated data set of s51 advices and their properties',
            schema: { $ref: '#/definitions/PaginatedDocumentDetails' }
        }
    */
	asyncHandler(getReadyToPublishAdvices)
);

export { router as s51AdviceRoutes };
