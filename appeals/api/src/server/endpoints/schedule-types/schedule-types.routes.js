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
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Schedule types',
			schema: { $ref: '#/definitions/AllScheduleTypesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('scheduleType'))
);

export { router as scheduleTypesRoutes };
