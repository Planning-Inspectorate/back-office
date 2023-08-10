import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/planning-obligation-statuses',
	/*
		#swagger.tags = ['Planning Obligation Statuses']
		#swagger.path = '/appeals/planning-obligation-statuses'
		#swagger.description = 'Gets planning obligation statuses'
		#swagger.responses[200] = {
			description: 'Planning obligation statuses',
			schema: { $ref: '#/definitions/AllPlanningObligationStatusesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('planningObligationStatus'))
);

export { router as planningObligationStatusesRoutes };
