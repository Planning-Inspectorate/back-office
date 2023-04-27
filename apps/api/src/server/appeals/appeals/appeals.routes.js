import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getAppealById, getAppeals } from './appeals.controller.js';
import { validateAppealId } from './appeals.validators.js';

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
		#swagger.description = 'Gets all appeals'
		#swagger.responses[200] = {
			description: 'Gets all appeals',
			schema: { $ref: '#/definitions/AllAppeals' }
		}
	 */
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
			schema: { $ref: '#/definitions/SingleAppeal' }
		}
	 */
	validateAppealId,
	asyncHandler(getAppealById)
);

export { router as appealsRoutes };
