import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';
import { getAllocationLevels, saveAllocation } from './appeal-allocation-controller.js';
import { getAllocationValidator, validateSpecialism } from './appeal-allocation-validator.js';
import { checkAppealExistsByIdAndAddToRequest } from '#middleware/check-appeal-exists-and-add-to-request.js';

const router = createRouter();

router.get(
	'/appeal-allocation-specialisms',
	/*
		#swagger.tags = ['Appeal Allocation']
		#swagger.path = '/appeals/appeal-allocation-specialisms'
		#swagger.description = 'Gets the list of specialisms used for allocation'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'List of allocation specialisms',
			schema: { $ref: '#/definitions/AllocationSpecialismsResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('specialism'))
);

router.get(
	'/appeal-allocation-levels',
	/*
		#swagger.tags = ['Appeal Allocation']
		#swagger.path = '/appeals/appeal-allocation-levels'
		#swagger.description = 'Gets the list of levels and associated bands used for allocation'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'List of allocation levels',
			schema: { $ref: '#/definitions/AllocationLevelsResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getAllocationLevels)
);

router.patch(
	'/:appealId/appeal-allocation',
	/*
		#swagger.tags = ['Appeal Allocation']
		#swagger.path = '/appeals/{appealId}/appeal-allocation'
		#swagger.description = 'Adds or changes allocation for an appeal'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal allocation',
			schema: { $ref: '#/definitions/AppealAllocation' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Patch appeal allocation',
			schema: { $ref: '#/definitions/AppealAllocation' },
		}
		#swagger.responses[400] = {}
	 */
	getAllocationValidator,
	validateSpecialism,
	checkAppealExistsByIdAndAddToRequest,
	asyncHandler(saveAllocation)
);

export { router as appealAllocationRouter };
