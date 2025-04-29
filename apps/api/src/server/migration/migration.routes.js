import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { postMigrateFolders, postMigrateModel } from './migration.controller.js';
import { validateMigration } from './validate-migration.controller.js';
import { getArchiveFolderInformation } from './archive-folder-info.controller.js';
import { migrationCleanup } from './migrators/migration-cleanup.controller.js';

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
	'/cleanup',
	/*
		#swagger.tags = ['Migration']
		#swagger.path = '/migration/cleanup'
		#swagger.description = 'Cleanup migration data for a case'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Case migration paremeters',
			schema: {
				caseReference: 'EN070007',
				skipLooseS51Attachments: false,
				skipHtmlTransform: false,
				skipFixExamFolders: false
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
			description: '',
            schema: { }
		}
	*/
	asyncHandler(migrationCleanup)
);

router.post(
	'/:modelType',
	/*
        #swagger.tags = ['Migration']
        #swagger.path =  '/migration/{modelType}'
        #swagger.description = 'Case Migration'
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

router.get(
	'/archive-folder-info',
	/*
		#swagger.tags = ['Migration']
		#swagger.path =  'migration/archive-folder-info'
		#swagger.description = 'Get archive folder information'
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
			description: '',
			schema: { }
		}
	*/
	asyncHandler(getArchiveFolderInformation)
);

export { router as migrationRoutes };
