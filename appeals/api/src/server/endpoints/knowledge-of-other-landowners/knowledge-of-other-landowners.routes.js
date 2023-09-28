import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/knowledge-of-other-landowners',
	/*
		#swagger.tags = ['Knowledge Of Other Landowners']
		#swagger.path = '/appeals/knowledge-of-other-landowners'
		#swagger.description = 'Gets knowledge of other landowners values'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Knowledge of other landowners values',
			schema: { $ref: '#/definitions/AllKnowledgeOfOtherLandownersResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('knowledgeOfOtherLandowners'))
);

export { router as knowledgeOfOtherLandownersRoutes };
