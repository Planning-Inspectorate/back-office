import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplications } from './case-search.controller.js';

const router = new express.Router();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/search'
        #swagger.description = 'Gets all applications as per search criteria'
        #swagger.responses[200] = {
            description: 'List of applications as per search criteria',
            schema: { $ref: '#/definitions/ApplicationsForSearchCriteria' }
        }
    */
	asyncHandler(getApplications)
);

export { router as caseSearchRoutes };
