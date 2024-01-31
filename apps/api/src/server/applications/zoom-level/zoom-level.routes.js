import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { getZoomLevels } from './zoom-level.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/zoom-level'
        #swagger.description = 'Gets all map zoom levels available'
        #swagger.responses[200] = {
            description: 'List of map zoom levels',
            schema: { $ref: '#/definitions/MapZoomLevelForApplications' }
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
	asyncHandler(getZoomLevels)
);

export { router as zoomLevelRoutes };
