import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
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
    */
	asyncHandler(getRegions)
);

export { router as regionRoutes };
