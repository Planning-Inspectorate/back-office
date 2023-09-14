import { Router as createRouter } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { postMigrateModel, postMigrateProjectUpdates } from './migration.controller.js';

const router = createRouter();

router.post(
	'/project-updates',
	/*
        #swagger.tags = ['Migration']
        #swagger.path =  '/migration/project-updates'
        #swagger.description = 'Migrate project updates'
        #swagger.parameters['documentGUID'] = {
            in: 'path',
            description: 'Document GUID',
			required: true,
			type: 'string'
        }
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Case References',
            schema: { caseReferences: ["BC0110005"] }
        }
        #swagger.responses[200] = {
            description: 'Project Updates successfully migrated',
        }
	 */
	asyncHandler(postMigrateProjectUpdates)
);

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
