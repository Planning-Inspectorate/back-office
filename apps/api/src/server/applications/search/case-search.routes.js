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
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'case query parameters',
			schema: { $ref: '#/definitions/ApplicationsForSearchCriteriaRequestBody' },
			required: true
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
