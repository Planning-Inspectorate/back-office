import { Router as createRouter } from 'express';
import { asyncHandler } from '../../../middleware/async-handler.js';
import { validateApplicationId } from '../application.validators.js';
import {
	getDocuments,
	getFolderPathList,
	getListOfFolders,
	getSingleFolder
} from './folders.controller.js';
import { validateFolderId, validateOptionalFolderId } from './folders.validation.js';

const router = createRouter();

router.get(
	'/:id/folders',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders'
        #swagger.description = 'Gets list of top level folders on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'IDs of application',
            schema: [ { id: 1, displayNameEn: 'Post-decision', displayOrder: 1100 } ]
        }
    */
	validateApplicationId,
	asyncHandler(getListOfFolders)
);

router.get(
	'/:id/folders/:folderId/sub-folders',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders/{folderId}'
        #swagger.description = 'Gets list of sub (child) folders in a folder on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder here',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'IDs of application',
            schema: [ { id: 1, displayNameEn: 'Post-decision', displayOrder: 1100 } ]
        }
    */
	validateApplicationId,
	validateOptionalFolderId,
	asyncHandler(getListOfFolders)
);

router.get(
	'/:id/folders/:folderId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders/{folderId}'
        #swagger.description = 'Gets details of a single folder on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder here',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'IDs of application',
            schema: { id: 1, displayNameEn: 'Post-decision', displayOrder: 1100 }
        }
    */
	validateApplicationId,
	validateOptionalFolderId,
	asyncHandler(getSingleFolder)
);

router.get(
	'/:id/folders/:folderId/parent-folders',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders/{folderId}/parent-folders'
        #swagger.description = 'Gets the parent folder path list for a folder on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder here',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'IDs of application',
            schema: [ { id: 1, displayNameEn: 'Post-decision', displayOrder: 100 },
					  { id: 2, displayNameEn: 'Acceptance', displayOrder: 200 },
		 	]
        }
    */
	validateApplicationId,
	validateOptionalFolderId,
	asyncHandler(getFolderPathList)
);

router.get(
	'/:id/folders/:folderId/documents',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders/{folderId}/parent-folders'
        #swagger.description = 'Gets all documents in folder on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID here',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder here',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'array of documents',
            schema: [ { "guid": "1111-1111-1111", "name": "David Doc 1", "folderId": 885, "blobStorageContainer": "xxx", "blobStoragePath": "yyy", "status": "unchecked" },
					  { "guid": "1234-5678-1234", "name": "David Doc 2", "folderId": 885, "blobStorageContainer": "xxx", "blobStoragePath": "zzz", "status": "unchecked" },
		 	]
        }
    */
	validateApplicationId,
	validateFolderId,
	asyncHandler(getDocuments)
);

export { router as fileFoldersRoutes };
