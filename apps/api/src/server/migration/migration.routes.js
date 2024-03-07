import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { postMigrateModel } from './migration.controller.js';

const router = createRouter();

router.post(
	'/:modelType',
	/*
        #swagger.tags = ['Migration']
        #swagger.path =  '/migration/{modelType}'
        #swagger.description = 'Updates document status from state machine'
        #swagger.parameters['modelType'] = {
            in: 'path',
            description: 'Model type to migrate',
			required: true,
			type: 'string'
        } 
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Models',
            schema: []
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
        #swagger.responses[200] = {
            description: 'Models successfully migrated',
        }
	 */
	asyncHandler(postMigrateModel)
);

export { router as migrationRoutes };
