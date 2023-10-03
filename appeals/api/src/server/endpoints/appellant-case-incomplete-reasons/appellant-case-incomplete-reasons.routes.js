import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/appellant-case-incomplete-reasons',
	/*
		#swagger.tags = ['Appellant Case Incomplete Reasons']
		#swagger.path = '/appeals/appellant-case-incomplete-reasons'
		#swagger.description = 'Gets appellant case incomplete reasons'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Appellant case incomplete reasons',
			schema: { $ref: '#/definitions/AllAppellantCaseIncompleteReasonsResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('appellantCaseIncompleteReason'))
);

export { router as appellantCaseIncompleteReasonsRoutes };
