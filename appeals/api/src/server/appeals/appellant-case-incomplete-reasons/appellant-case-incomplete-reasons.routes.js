import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/appellant-case-incomplete-reasons'
		#swagger.description = 'Gets appellant case incomplete reasons'
		#swagger.responses[200] = {
			description: 'Appellant case incomplete reasons',
			schema: { $ref: '#/definitions/AllAppellantCaseIncompleteReasonsResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('appellantCaseIncompleteReason'))
);

export { router as appellantCaseIncompleteReasonsRoutes };
