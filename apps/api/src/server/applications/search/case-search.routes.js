import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplicationsByCriteria } from './case-search.controller.js';
import { validateSearchCriteria } from './case-search.validators.js';

const router = new express.Router();

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/search'
        #swagger.description = 'Gets all applications as per search criteria'
		#swagger.parameters['query'] = {
            in: 'body',
			description: 'search criteria searched in Application Reference, Title, or Description',
			example: 'EN01',
            type: 'string',
            required: true
        }
		#swagger.parameters['role'] = {
            in: 'body',
			description: 'a valid role',
            type: 'string',
            required: true
        }
		#swagger.parameters['pageNumber'] = {
            in: 'body',
			description: 'page number of the paginated data to return, starting at 1 [default]',
			example: '1',
            type: 'int',
            required: false
        }
		#swagger.parameters['pageSize'] = {
            in: 'body',
			description: 'number of results per page of paginated results.  Defaults to 20',
			example: '20',
            type: 'int',
            required: false
        }
        #swagger.responses[200] = {
            description: 'List of applications as per search criteria',
            schema: { $ref: '#/definitions/ApplicationsForSearchCriteria' }
        }
    */
	validateSearchCriteria,
	asyncHandler(getApplicationsByCriteria)
);

export { router as caseSearchRoutes };
