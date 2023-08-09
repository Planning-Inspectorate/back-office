import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/lpa-notification-methods',
	/*
		#swagger.tags = ['LPA Notification Methods']
		#swagger.path = '/appeals/lpa-notification-methods'
		#swagger.description = 'Gets LPA notification methods'
		#swagger.responses[200] = {
			description: 'LPA notification methods',
			schema: { $ref: '#/definitions/AllLPANotificationMethodsResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('lPANotificationMethods'))
);

export { router as lpaNotificationMethodsRoutes };
