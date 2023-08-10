import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/site-visit-types',
	/*
		#swagger.tags = ['Site Visit Types']
		#swagger.path = '/appeals/site-visit-types'
		#swagger.description = 'Gets site visit types'
		#swagger.responses[200] = {
			description: 'Site visit types',
			schema: { $ref: '#/definitions/AllSiteVisitTypesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('siteVisitType'))
);

export { router as siteVisitTypesRoutes };
