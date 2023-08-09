import { Router as createRouter } from 'express';
import { validateApplicationId } from '../application.validators.js';
import { validatePaginationParameters } from '../../../middleware/pagination-validation.js';
import { asyncHandler } from '../../../middleware/async-handler.js';
import * as controller from './project-updates.controller.js';
import { validateSortBy } from '../../../middleware/validate-sort-by.js';
import {
	validateCreateProjectUpdate,
	validateProjectUpdateFilters,
	validateProjectUpdateId,
	validateUpdateProjectUpdate
} from './project-updates.validators.js';

const router = createRouter();

router.get(
	'/project-updates',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/project-updates'
        #swagger.description = 'Get project updates across applications'
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
		#swagger.parameters['status'] = {
			in: 'query',
			description: 'Filter by status',
			required: false,
			type: 'string'
		}
        #swagger.parameters['publishedBefore'] = {
			in: 'query',
			description: 'Filter by published date',
			required: false,
			type: 'string',
            format: 'date-time'
		}
        #swagger.parameters['sentToSubscribers'] = {
			in: 'query',
			description: 'Filter by sent to subscribers',
			required: false,
			type: 'boolean'
		}
        #swagger.responses[200] = {
            description: 'List of project updates',
			schema: { $ref: '#/definitions/ApplicationProjectUpdates' },
        }
        #swagger.responses[400] = {
            description: 'Bad request',
			schema: { $ref: '#/definitions/ApplicationProjectUpdatesListBadRequest' },
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validatePaginationParameters(),
	validateProjectUpdateFilters,
	asyncHandler(controller.getProjectUpdates)
);

router.get(
	'/project-updates/:projectUpdateId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/project-updates/{projectUpdateId}'
        #swagger.description = 'Get a project update by ID'
        #swagger.parameters['projectUpdateId'] = {
            in: 'path',
			description: 'Project Update ID',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'The project update',
			schema: { $ref: '#/definitions/ApplicationProjectUpdate' },
        }
        #swagger.responses[404] = {
            description: 'Not found',
            schema: { $ref: '#/definitions/NotFound' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateProjectUpdateId,
	asyncHandler(controller.getProjectUpdate)
);

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
         #swagger.responses[400] = {
            description: 'Bad request',
			schema: { $ref: '#/definitions/ApplicationProjectUpdatesListBadRequest' },
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateApplicationId,
	validatePaginationParameters(),
	validateSortBy(['datePublished', 'emailSubscribers', 'status']),
	asyncHandler(controller.getProjectUpdatesForCase)
);

router.post(
	'/:id/project-updates',
	/*
		#swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-updates'
        #swagger.description = 'Create a project update for this application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Project update parameters',
            schema: { $ref: '#/definitions/ApplicationProjectUpdateCreateRequest' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Created project update',
			schema: { $ref: '#/definitions/ApplicationProjectUpdate' },
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/ApplicationProjectUpdateCreateBadRequest' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
	*/
	validateApplicationId,
	validateCreateProjectUpdate,
	asyncHandler(controller.postProjectUpdate)
);

router.get(
	'/:id/project-updates/:projectUpdateId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-updates/{projectUpdateId}'
        #swagger.description = 'Get a project update'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['projectUpdateId'] = {
            in: 'path',
			description: 'Project Update ID',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'The project update',
			schema: { $ref: '#/definitions/ApplicationProjectUpdate' },
        }
        #swagger.responses[404] = {
            description: 'Not found',
            schema: { $ref: '#/definitions/NotFound' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateApplicationId,
	validateProjectUpdateId,
	asyncHandler(controller.getProjectUpdate)
);

router.patch(
	'/:id/project-updates/:projectUpdateId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-updates/{projectUpdateId}'
        #swagger.description = 'Update a project update'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['projectUpdateId'] = {
            in: 'path',
			description: 'Project Update ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Project update parameters',
            schema: { $ref: '#/definitions/ApplicationProjectUpdateUpdateRequest' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'The project update',
			schema: { $ref: '#/definitions/ApplicationProjectUpdate' },
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/ApplicationProjectUpdateCreateBadRequest' }
        }
        #swagger.responses[404] = {
            description: 'Not found',
            schema: { $ref: '#/definitions/NotFound' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateApplicationId,
	validateProjectUpdateId,
	validateUpdateProjectUpdate,
	asyncHandler(controller.patchProjectUpdate)
);

router.delete(
	'/:id/project-updates/:projectUpdateId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-updates/{projectUpdateId}'
        #swagger.description = 'Delete a project update'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
        #swagger.parameters['projectUpdateId'] = {
            in: 'path',
			description: 'Project Update ID',
			required: true,
			type: 'integer'
		}
        #swagger.responses[204] = {
            description: 'Successfully deleted'
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/GeneralError' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateApplicationId,
	validateProjectUpdateId,
	asyncHandler(controller.deleteProjectUpdate)
);

export { router as projectUpdateRoutes };
