import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { getLinkableAppealById } from './linkable-appeal.controller.js';

const router = createRouter();

router.get(
	'/linkable-appeal/:appealReference',
	/*
		#swagger.tags = ['Linkable appeals']
		#swagger.path = '/appeals/linkable-appeal/{appealReference}'
		#swagger.description = Gets a single related appeal by id from BO or Horizon. If mocking use 1000000 for valid case on horizon, 2000000 for unpublished case on horizon, any for case not found on horizon
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.parameters['appealReference'] = {
            in: 'path',
            description: 'Appeal Reference',
            required: true,
            type: 'string'
        }
		#swagger.responses[200] = {
			description: 'Gets a single related appeal by reference from BO or Horizon',
			schema: { $ref: '#/definitions/SingleLinkableAppealSummaryResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(getLinkableAppealById)
);

export { router as linkedAppealsRoutes };
