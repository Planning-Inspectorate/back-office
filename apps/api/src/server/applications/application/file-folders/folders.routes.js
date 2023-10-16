import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { validateApplicationId } from '../application.validators.js';
import {
	getDocuments,
	getFolderPathList,
	getListOfFolders,
	getSingleFolder
} from './folders.controller.js';
import { validateFolderId } from './folders.validation.js';

const router = createRouter();

router.get(
	'/:id/folders',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders'
        #swagger.description = 'Gets list of top level folders on a case'
        #swagger.parameters['id'] = {
          in: 'path',
          description: 'Application ID',
          required: true,
          type: 'integer'
        }
        #swagger.parameters['all'] = {
          in: 'query',
          description: 'Should retrieve the full list of folders, not just root level ones',
          required: false,
          type: 'boolean'
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
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'IDs of application',
            schema: [ { id: 1, displayNameEn: 'Post-decision', displayOrder: 1100 } ]
        }
    */
	validateApplicationId,
	validateFolderId,
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
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder',
			required: true,
			type: 'integer'
		}
        #swagger.responses[200] = {
            description: 'IDs of application',
            schema: { id: 1, displayNameEn: 'Post-decision', displayOrder: 1100 }
        }
    */
	validateApplicationId,
	validateFolderId,
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
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder',
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
	validateFolderId,
	asyncHandler(getFolderPathList)
);

router.post(
	'/:id/folders/:folderId/documents',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders/{folderId}/documents'
        #swagger.description = 'Gets paginated array of documents in a folder on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
            in: 'path',
			description: 'Id of current folder',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'document pagination parameters',
			schema: { $ref: '#/definitions/PaginationRequestBody' },
			required: true
		}
        #swagger.responses[200] = {
            description: 'An paginated data set of documents and their properties',
            schema: { $ref: '#/definitions/PaginatedDocumentDetails' }
        }
    */
	validateApplicationId,
	validateFolderId,
	asyncHandler(getDocuments)
);

export { router as fileFoldersRoutes };
