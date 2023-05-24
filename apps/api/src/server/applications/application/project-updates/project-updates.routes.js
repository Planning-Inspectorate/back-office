import { Router as createRouter } from 'express';
import { validateApplicationId } from '../application.validators.js';
import { validatePaginationParameters } from '../../../middleware/pagination-validation.js';
import { asyncHandler } from '../../../middleware/async-handler.js';
import { getProjectUpdates } from './project-updates.controller.js';

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
		#swagger.parameters['pageNumber'] = {
			in: 'query',
			description: 'The page number to return, defaults to 1',
			example: 1,
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The number of results per page, defaults to 25',
			example: 25,
		}
        #swagger.responses[200] = {
            description: 'List of project updates',
			schema: { $ref: '#/definitions/ApplicationProjectUpdates' },
        }
    */
	validateApplicationId,
	validatePaginationParameters,
	asyncHandler(getProjectUpdates)
);

export { router as projectUpdateRoutes };
