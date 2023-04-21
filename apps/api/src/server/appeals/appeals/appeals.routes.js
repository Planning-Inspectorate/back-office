import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getAppeals } from './appeals.controller.js';

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

export { router as appealsRoutes };
