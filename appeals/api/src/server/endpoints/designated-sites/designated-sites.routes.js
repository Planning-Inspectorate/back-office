import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/designated-sites',
	/*
		#swagger.tags = ['Designated Sites']
		#swagger.path = '/appeals/designated-sites'
		#swagger.description = 'Gets designated sites'
		#swagger.responses[200] = {
			description: 'Designated sites',
			schema: { $ref: '#/definitions/AllDesignatedSitesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('designatedSite'))
);

export { router as designatedSitesRoutes };
