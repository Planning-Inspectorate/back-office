import { Router as createRouter } from 'express';
import { validateApplicationId } from '../application.validators.js';
import { validatePaginationParameters } from '../../../middleware/pagination-validation.js';
import { asyncHandler } from '../../../middleware/async-handler.js';
import { getProjectUpdates } from './project-updates.controller.js';
import { validateSortBy } from '../../../middleware/validate-sort-by.js';

const router = createRouter();

router.get(
	'/:id/project-updates',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-updates'
        #swagger.description = 'List the project updates for this application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['page'] = {
			in: 'query',
			description: 'The page number to return, defaults to 1',
			example: 1,
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The number of results per page, defaults to 25',
			example: 25,
		}
		#swagger.parameters['sortBy'] = {
			in: 'query',
			description: 'Sort by field. +field for ASC, -field for DESC',
			required: false,
			type: 'string'
		}
        #swagger.responses[200] = {
            description: 'List of project updates',
			schema: { $ref: '#/definitions/ApplicationProjectUpdates' },
        }
    */
	validateApplicationId,
	validatePaginationParameters(),
	validateSortBy(['datePublished', 'emailSubscribers', 'status']),
	asyncHandler(getProjectUpdates)
);

export { router as projectUpdateRoutes };
