import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/appellant-case-validation-outcomes',
	/*
		#swagger.tags = ['Appellant Case Validation Outcomes']
		#swagger.path = '/appeals/appellant-case-validation-outcomes'
		#swagger.description = 'Gets appellant case validation outcomes'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Appellant case validation outcomes',
			schema: { $ref: '#/definitions/AllAppellantCaseValidationOutcomesResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('appellantCaseValidationOutcome'))
);

export { router as appellantCaseValidationOutcomesRoutes };
