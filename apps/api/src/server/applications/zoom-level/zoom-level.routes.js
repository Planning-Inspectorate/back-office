import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getZoomLevels } from './zoom-level.controller.js';

const router = new express.Router();

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
    */
	asyncHandler(getZoomLevels)
);

export { router as zoomLevelRoutes };
