import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { documentsRoutes } from '../documents/documents.routes.js';
import { getAppealById, getAppeals, updateAppealById } from './appeals.controller.js';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import {
	getAppealsValidator,
	getAppealValidator,
	patchAppealValidator
} from './appeals.validators.js';

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals'
		#swagger.description = 'Gets requested appeals, limited to the first 30 appeals if no pagination params are given'
		#swagger.parameters['pageNumber'] = {
			in: 'query',
			description: 'The pagination page number - required if pageSize is given',
			example: 1,
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The pagination page size - required if pageNumber is given',
			example: 30,
		}
		#swagger.parameters['searchTerm'] = {
			in: 'query',
			description: 'The search term - does a partial, case-insensitive match of appeal reference and postcode fields',
			example: 'NR35 2ND',
		}
		#swagger.responses[200] = {
			description: 'Requested appeals',
			schema: { $ref: '#/definitions/AllAppeals' },
		}
		#swagger.responses[400] = {}
	 */
	getAppealsValidator,
	asyncHandler(getAppeals)
);

router.use(documentsRoutes);

router.get(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}'
		#swagger.description = Gets a single appeal by id
		#swagger.responses[200] = {
			description: 'Gets a single appeal by id',
			schema: { $ref: '#/definitions/SingleAppealResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	asyncHandler(getAppealById)
);

router.patch(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}'
		#swagger.description = 'Updates a single appeal by id'
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal details to update',
			schema: { $ref: '#/definitions/UpdateAppealRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Updates a single appeal by id',
			schema: { $ref: '#/definitions/UpdateAppealResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[500] = {}
	 */
	patchAppealValidator,
	checkAppealExistsAndAddToRequest,
	asyncHandler(updateAppealById)
);

export { router as appealsRoutes };
