import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import * as controller from './notification-logs.controller.js';
import { validateProjectUpdateId } from '../project-updates.validators.js';
import { validateApplicationId } from '../../application.validators.js';
import { validatePaginationParameters } from '#middleware/pagination-validation.js';
import { validateCreateNotificationLogs } from './notification-logs.validators.js';

const router = createRouter();

router.get(
	'/:id/project-updates/:projectUpdateId/notification-logs',
	/*
		#swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-updates/{projectUpdateId}/notification-logs'
        #swagger.description = 'List notification logs'
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
        #swagger.responses[200] = {
            description: 'Notification logs',
			schema: { $ref: '#/definitions/ProjectUpdateNotificationLogList' },
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/ProjectUpdateNotificationLogListBadRequest' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
	*/
	validateApplicationId,
	validateProjectUpdateId,
	validatePaginationParameters(),
	asyncHandler(controller.getNotificationLogs)
);

router.post(
	'/:id/project-updates/:projectUpdateId/notification-logs',
	/*
		#swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/project-updates/{projectUpdateId}/notification-logs'
        #swagger.description = 'Add notification logs'
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
            description: 'Logs to create',
            schema: { $ref: '#/definitions/ProjectUpdateNotificationLogCreateRequest' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Created',
            schema: {count: 1}
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/ProjectUpdateNotificationLogCreateBadRequest' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
	*/
	validateApplicationId,
	validateProjectUpdateId,
	validateCreateNotificationLogs,
	asyncHandler(controller.postNotificationLogs)
);

export { router as projectUpdateNotificationLogsRoutes };
