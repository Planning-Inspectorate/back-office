import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { getRegions } from './region.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/region'
        #swagger.description = 'Gets all regions available'
        #swagger.responses[200] = {
            description: 'List of regions',
            schema: { $ref: '#/definitions/RegionsForApplications' }
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
	asyncHandler(getRegions)
);

export { router as regionRoutes };
