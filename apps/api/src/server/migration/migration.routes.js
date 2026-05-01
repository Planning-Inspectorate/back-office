import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { postMigrateFolders, postMigrateModel } from './migration.controller.js';
import { validateMigration } from './validate-migration.controller.js';
import { getArchiveFolderInformation } from './archive-folder-info.controller.js';
import { migrationCleanup } from './migrators/migration-cleanup.controller.js';
import {
	migrateGisShapefilesFolders,
	deleteGisShapefilesFoldersController
} from './migrators/gis-shapefiles-folder.controller.js';

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
			description: 'Case migration parameters',
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

// Place static routes BEFORE parameterized ones
router.post(
	'/gis-shapefiles-folders',
	/*
		#swagger.tags = ['Migration']
		#swagger.path = '/migration/gis-shapefiles-folders'
		#swagger.description = 'Bulk create GIS Shapefiles folder for all existing cases (idempotent, safe to rerun)'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Migration options',
			required: false,
			schema: {
				caseIds: [1, 2, 3],
				dryRun: true
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
			description: 'GIS Shapefiles folder migration results',
		}
	*/
	asyncHandler(migrateGisShapefilesFolders)
);

router.post(
	'/gis-shapefiles-folders/delete',
	/*
		#swagger.tags = ['Migration']
		#swagger.path = '/migration/gis-shapefiles-folders/delete'
		#swagger.description = 'Bulk or per-case delete GIS Shapefiles folders by name. Accepts { caseIds?: number[], dryRun?: boolean }.'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Delete options',
			schema: { caseIds: [1,2,3], dryRun: true }
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
			description: 'GIS Shapefiles folder deletion results',
		}
	*/
	asyncHandler(deleteGisShapefilesFoldersController)
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

router.post(
	'/gis-shapefiles-folders',
	/*
	       #swagger.tags = ['Migration']
	       #swagger.path = '/migration/gis-shapefiles-folders'
	       #swagger.description = 'Bulk create GIS Shapefiles folder for all existing cases (idempotent, safe to rerun)'
		       #swagger.parameters['body'] = {
			       in: 'body',
			       description: 'Migration options',
			       required: false,
			       schema: {
				       caseIds: [1, 2, 3],
				       dryRun: true
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
		       description: 'GIS Shapefiles folder migration results',
	       }
       */
	asyncHandler(migrateGisShapefilesFolders)
);

router.post(
	'/gis-shapefiles-folders/delete',
	/*
	       #swagger.tags = ['Migration']
	       #swagger.path = '/migration/gis-shapefiles-folders/delete'
	       #swagger.description = 'Bulk or per-case delete GIS Shapefiles folders by name. Accepts { caseIds?: number[], dryRun?: boolean }.'
	       #swagger.parameters['body'] = {
		       in: 'body',
		       description: 'Delete options',
		       schema: { caseIds: [1,2,3], dryRun: true }
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
		       description: 'GIS Shapefiles folder deletion results',
	       }
       */
	asyncHandler(deleteGisShapefilesFoldersController)
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
