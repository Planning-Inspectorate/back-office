import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { checkAppealExistsByIdAndAddToRequest } from '#middleware/check-appeal-exists-and-add-to-request.js';
import {
	loadAllAppealTypesAndAddToRequest,
	validateAppealType,
	validateAppealStatus,
	validateAppealStatusForTransfer
} from './change-appeal-type.middleware.js';
import {
	getAppealTypes,
	requestChangeOfAppealType,
	requestTransferOfAppeal,
	requestConfirmationTransferOfAppeal
} from './change-appeal-type.controller.js';
import {
	postAppealTypeChangeValidator,
	postAppealTypeTransferValidator,
	postAppealTypeTransferConfirmationValidator
} from './change-appeal-type.validators.js';

const router = createRouter();

router.get(
	'/:appealId/appeal-types',
	/*
		#swagger.tags = ['Appeal Type Change Request']
		#swagger.path = '/appeals/{appealId}/appeal-types'
		#swagger.description = 'Gets the list of appeal types'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'List of appeal types',
			schema: { $ref: '#/definitions/AppealTypes' },
		}
		#swagger.responses[400] = {}
	 */
	loadAllAppealTypesAndAddToRequest,
	checkAppealExistsByIdAndAddToRequest,
	asyncHandler(getAppealTypes)
);

router.post(
	'/:appealId/appeal-change-request',
	/*
		#swagger.tags = ['Appeal Type Change Request']
		#swagger.path = '/appeals/{appealId}/appeal-change-request'
		#swagger.description = 'Records a request to change the appeal type'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal type change request',
			schema: { $ref: '#/definitions/AppealTypeChangeRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	loadAllAppealTypesAndAddToRequest,
	checkAppealExistsByIdAndAddToRequest,
	validateAppealStatus,
	validateAppealType,
	postAppealTypeChangeValidator,
	asyncHandler(requestChangeOfAppealType)
);

router.post(
	'/:appealId/appeal-transfer-request',
	/*
		#swagger.tags = ['Appeal Type Change Request']
		#swagger.path = '/appeals/{appealId}/appeal-transfer-request'
		#swagger.description = 'Records a request to transfer the appeal to another system'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal type transfer request',
			schema: { $ref: '#/definitions/AppealTypeTransferRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	loadAllAppealTypesAndAddToRequest,
	checkAppealExistsByIdAndAddToRequest,
	validateAppealStatus,
	validateAppealType,
	postAppealTypeTransferValidator,
	asyncHandler(requestTransferOfAppeal)
);

router.post(
	'/:appealId/appeal-transfer-confirmation',
	/*
		#swagger.tags = ['Appeal Type Change Request']
		#swagger.path = '/appeals/{appealId}/appeal-transfer-confirmation'
		#swagger.description = 'Confirms the transfer of the appeal to another system'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Appeal type transfer confirmation',
			schema: { $ref: '#/definitions/AppealTypeTransferConfirmationRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	checkAppealExistsByIdAndAddToRequest,
	validateAppealStatusForTransfer,
	postAppealTypeTransferConfirmationValidator,
	asyncHandler(requestConfirmationTransferOfAppeal)
);

export { router as changeAppealTypeRoutes };
