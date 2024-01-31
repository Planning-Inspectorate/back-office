import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { trimUnexpectedRequestParameters } from '#middleware/trim-unexpected-request-parameters.js';
import { getApplicationsByCriteria } from './case-search.controller.js';
import { validateSearchCriteria } from './case-search.validators.js';

const router = createRouter();

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/search'
        #swagger.description = 'Gets all applications as per search criteria'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'case query parameters',
			schema: { $ref: '#/definitions/ApplicationsSearchCriteriaRequestBody' },
			required: true
		}
        #swagger.responses[200] = {
            description: 'List of applications as per search criteria',
            schema: { $ref: '#/definitions/ApplicationsSearchResponse' }
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
	validateSearchCriteria,
	trimUnexpectedRequestParameters,
	asyncHandler(getApplicationsByCriteria)
);

export { router as caseSearchRoutes };
