import { Router as createRouter } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { postMigrateModel } from './migration.controller.js';

const router = createRouter();

router.post(
	'/:modelType',
	/*
        #swagger.tags = ['Migration']
        #swagger.path =  '/migration/:modelType'
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
        #swagger.responses[200] = {
            description: 'Models successfully migrated',
        }
	 */
	asyncHandler(postMigrateModel)
);

export { router as migrationRoutes };
