import express from 'express';
import { param } from 'express-validator';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplicationsByCriteria } from './case-search.controller.js';

const router = new express.Router();

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/search'
        #swagger.description = 'Gets all applications as per search criteria'
		#swagger.parameters['searchCriteria'] = {
            in: 'header',
            type: 'string',
            required: true
        }
        #swagger.responses[200] = {
            description: 'List of applications as per search criteria',
            schema: { $ref: '#/definitions/ApplicationsForSearchCriteria' }
        }
    */
	param('query', 'role', 'pageNumber', 'pageSize'),
	asyncHandler(getApplicationsByCriteria)
);

export { router as caseSearchRoutes };
