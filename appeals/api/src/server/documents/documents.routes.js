import { Router as createRouter } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { getDocuments } from './documents.controller.js';

/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

const router = createRouter();

router.get(
	'/:appealId/documents',
	/*
		#swagger.tags = ['Appeal Documents']
		#swagger.path = '/appeals/{appealId}/documents'
		#swagger.description = Returns the contents of the appeal folders
		#swagger.responses[200] = {
			description: 'Gets all the documents for a specific appeal by id',
			schema: { $ref: '#/definitions/Folder' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(getDocuments)
);

export { router as documentsRoutes };
