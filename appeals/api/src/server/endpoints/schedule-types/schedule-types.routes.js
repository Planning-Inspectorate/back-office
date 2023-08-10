import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/schedule-types',
	/*
		#swagger.tags = ['Schedule Types']
		#swagger.path = '/appeals/schedule-types'
		#swagger.description = 'Gets schedule types'
		#swagger.responses[200] = {
			description: 'Schedule types',
			schema: { $ref: '#/definitions/AllScheduleTypesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('scheduleType'))
);

export { router as scheduleTypesRoutes };
