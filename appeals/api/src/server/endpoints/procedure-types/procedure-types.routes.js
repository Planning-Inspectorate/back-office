import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/procedure-types',
	/*
		#swagger.tags = ['Procedure Types']
		#swagger.path = '/appeals/procedure-types'
		#swagger.description = 'Gets procedure types'
		#swagger.responses[200] = {
			description: 'Procedure types',
			schema: { $ref: '#/definitions/AllProcedureTypesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('procedureType'))
);

export { router as procedureTypesRoutes };
