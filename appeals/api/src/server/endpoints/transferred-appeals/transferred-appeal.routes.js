import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { getTransferredAppealStatusByCaseReference } from './transferred-appeal.controller.js';

const router = createRouter();

router.get(
	'/transferred-appeal/:appealReference',
	/*
		#swagger.tags = ['Transferred appeals']
		#swagger.path = '/appeals/transferred-appeal/{appealReference}'
		#swagger.description = Gets appeal from Horizon returns found status (true/false). If mocking use 1000000 for valid case on horizon, 2000000 for unpublished case on horizon, any for case not found on horizon
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
			description: 'Gets appeal from Horizon returns found status (true/false)',
			schema: { $ref: '#/definitions/ExistsOnHorizonResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	asyncHandler(getTransferredAppealStatusByCaseReference)
);

export { router as transferredAppealsRoutes };
