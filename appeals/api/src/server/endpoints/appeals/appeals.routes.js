import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { getAppeal, getAppeals, updateAppealById, getMyAppeals } from './appeals.controller.js';
import {
	checkAppealExistsByIdAndAddToRequest,
	checkAppealExistsByCaseReferenceAndAddToRequest
} from '#middleware/check-appeal-exists-and-add-to-request.js';
import {
	getAppealsValidator,
	getAppealValidator,
	patchAppealValidator
} from './appeals.validators.js';
import { validateAppealStatus, validateHasInspector } from './appeals.middleware.js';

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals'
		#swagger.description = 'Gets requested appeals, limited to the first 30 appeals if no pagination params are given'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.parameters['pageNumber'] = {
			in: 'query',
			description: 'The pagination page number - required if pageSize is given',
			example: 1,
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The pagination page size - required if pageNumber is given',
			example: 30,
		}
		#swagger.parameters['searchTerm'] = {
			in: 'query',
			description: 'The search term - does a partial, case-insensitive match of appeal reference and postcode fields',
			example: 'NR35 2ND',
		}
		#swagger.parameters['status'] = {
			in: 'query',
			description: 'The appeal status',
			example: 'lpa_questionnaire_due',
		}
		#swagger.parameters['hasInspector'] = {
			in: 'query',
			description: 'The Inspector Filter assigned status',
			example: 'true',
		}
		#swagger.responses[200] = {
			description: 'Requested appeals',
			schema: { $ref: '#/definitions/AllAppeals' },
		}
		#swagger.responses[400] = {}
	 */
	getAppealsValidator,
	validateAppealStatus,
	validateHasInspector,
	asyncHandler(getAppeals)
);

router.get(
	'/my-appeals',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/my-appeals'
		#swagger.description = 'Gets appeals assigned to the current user'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.parameters['pageNumber'] = {
			in: 'query',
			description: 'The pagination page number - required if pageSize is given',
			example: 1,
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The pagination page size - required if pageNumber is given',
			example: 30,
		}
		#swagger.parameters['status'] = {
			in: 'query',
			description: 'The appeal status',
			example: 'lpa_questionnaire_due',
		}
		#swagger.responses[200] = {
			description: 'Requested appeals',
			schema: { $ref: '#/definitions/AllAppeals' },
		}
		#swagger.responses[400] = {}
	 */
	getAppealsValidator,
	validateAppealStatus,
	asyncHandler(getMyAppeals)
);

router.get(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}'
		#swagger.description = Gets a single appeal by id
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Gets a single appeal by id',
			schema: { $ref: '#/definitions/SingleAppealResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppealValidator,
	checkAppealExistsByIdAndAddToRequest,
	asyncHandler(getAppeal)
);

router.get(
	'/case-reference/:caseReference',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-reference/{caseReference}'
		#swagger.description = Gets a single appeal by case reference
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Gets a single appeal by id',
			schema: { $ref: '#/definitions/SingleAppealResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	checkAppealExistsByCaseReferenceAndAddToRequest,
	asyncHandler(getAppeal)
);

router.patch(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}'
		#swagger.description = 'Updates a single appeal by id'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal details to update',
			schema: { $ref: '#/definitions/UpdateAppealRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Updates a single appeal by id',
			schema: { $ref: '#/definitions/UpdateAppealResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[500] = {}
	 */
	patchAppealValidator,
	checkAppealExistsByIdAndAddToRequest,
	asyncHandler(updateAppealById)
);

export { router as appealsRoutes };
