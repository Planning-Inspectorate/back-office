import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getAppealById, getAppeals } from './appeals.controller.js';
import { validateAppealId, validatePaginationParameters } from './appeals.validators.js';

/**
 * @typedef {object} AppealParams
 * @property {number} appealId
 */

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals'
		#swagger.description = 'Gets requested appeals, limited to the first 30 if no pagination params are given'
		#swagger.parameters['pageNumber'] = {
			in: 'query',
			description: 'The pagination page number, required if pageSize is given',
			example: 1,
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The pagination page size, required if pageNumber is given',
			example: 30,
		}
		#swagger.responses[200] = {
			description: 'Requested appeals',
			schema: { $ref: '#/definitions/AllAppeals' },
		}
		#swagger.responses[400] = {}
	 */
	validatePaginationParameters,
	asyncHandler(getAppeals)
);

router.get(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}'
		#swagger.description = 'Gets a single appeal by id'
		#swagger.responses[200] = {
			description: 'Gets a single appeal by id',
			schema: { $ref: '#/definitions/SingleAppeal' },
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	validateAppealId,
	asyncHandler(getAppealById)
);

export { router as appealsRoutes };
