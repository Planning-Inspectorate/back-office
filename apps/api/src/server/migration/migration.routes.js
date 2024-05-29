import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { postMigrateFolders, postMigrateModel } from './migration.controller.js';
import { validateMigration } from './validate-migration.controller.js';

const router = createRouter();

router.post(
	'/folder',
	/*
        #swagger.tags = ['Migration']
        #swagger.path =  '/migration/folder'
        #swagger.description = 'Migrate folders'
        #swagger.parameters['body'] = {
			in: 'body',
			description: 'Case reference',
			schema: {
				caseReference: 'TR020002'
			}
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
	asyncHandler(postMigrateFolders)
);

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
// takes caseReference array as query parameter
// returns the BO data for cases includng project, serviceUsers, documents, s51Advice, representations, examTimetables
router.get(
	'/validate',
	/*
				#swagger.tags = ['Migration']
				#swagger.path =  '/migration/validate'
				#swagger.description = 'Validate migration'
				#swagger.parameters['query'] = {
						caseReferences: 'TR020002,TR020003'
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
						description: 'Document status updated',
            schema: { }
				}
			*/

	asyncHandler(validateMigration)
);

export { router as migrationRoutes };
