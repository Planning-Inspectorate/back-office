import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { validateApplicationId } from '../application.validators.js';
import {
	createFolder,
	deleteFolder,
	getDocuments,
	getFolderPathList,
	getListOfFolders,
	getSingleFolder,
	updateFolder
} from './folders.controller.js';
import {
	validateCreateBody,
	validateFolderDocumentsSortBy,
	validateFolderId
} from './folders.validation.js';

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

router.get(
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
		#swagger.parameters['sortBy'] = {
						in: 'query',
						description: 'Sort by field',
						required: false,
						type: 'string',
		}
		#swagger.parameters['pageNumber'] = {
						in: 'query',
						description: 'Page number',
						required: false,
						type: 'integer',
						default: 1
		}
		#swagger.parameters['pageSize'] = {
						in: 'query',
						description: 'Page size',
						required: false,
						type: 'integer',
						default: 25
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
            description: 'An paginated data set of documents and their properties',
            schema: { $ref: '#/definitions/PaginatedDocumentDetails' }
        }
    */
	validateApplicationId,
	validateFolderId,
	validateFolderDocumentsSortBy,
	asyncHandler(getDocuments)
);

router.post(
	'/:id/folders/create-folder',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders/create-folder'
        #swagger.description = 'Creates a folder, either at the top-level or under a parent folder.'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
            in: 'body',
			description: 'Create folder parameters',
			required: true,
      		schema: { $ref: '#/definitions/CreateFolderRequestBody' }
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
            description: 'The newly created folder',
            schema: { id: 1, displayNameEn: 'Example', displayOrder: 1100 }
        }
    */
	validateApplicationId,
	validateCreateBody,
	asyncHandler(createFolder)
);

router.patch(
	'/:id/folders/:folderId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/folders/{folderId}'
        #swagger.description = 'Updates the details of a folder'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
    #swagger.parameters['folderId'] = {
      in: 'path',
      description: 'Folder ID',
      required: true,
      type: 'integer'
    }
		#swagger.parameters['body'] = {
            in: 'body',
			description: 'Create document parameters',
			required: true,
      schema: { $ref: '#/definitions/UpdateFolderRequestBody' }
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
            description: 'The newly created folder',
            schema: { id: 1, displayNameEn: 'Example', displayOrder: 1100 }
        }
    */
	validateApplicationId,
	validateFolderId,
	asyncHandler(updateFolder)
);

router.delete(
	'/:id/folders/:folderId',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/{id}/folders/{folderId}'
		#swagger.description = 'Deletes a folder as long as it is empty'
		#swagger.parameters['id'] = {
			in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['folderId'] = {
			in: 'path',
			description: 'Folder ID to delete',
			required: true,
			type: 'integer'
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
            description: 'The newly deleted folder',
            schema: { id: 1, displayNameEn: 'Example', displayOrder: 1100 }
        }
	*/
	validateApplicationId,
	validateFolderId,
	asyncHandler(deleteFolder)
);

export { router as fileFoldersRoutes };
