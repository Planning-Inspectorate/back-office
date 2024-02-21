import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { getAddressById, updateAddressById } from './addresses.controller.js';
import { checkAppealExistsByIdAndAddToRequest } from '#middleware/check-appeal-exists-and-add-to-request.js';
import { checkAddressExists } from './addresses.service.js';
import { getAddressValidator, patchAddressValidator } from './addresses.validators.js';

const router = createRouter();

router.get(
	'/:appealId/addresses/:addressId',
	/*
		#swagger.tags = ['Addresses']
		#swagger.path = '/appeals/{appealId}/addresses/{addressId}'
		#swagger.description = Gets a single address by id
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Gets a single address by id',
			schema: { $ref: '#/definitions/SingleAddressResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAddressValidator,
	checkAppealExistsByIdAndAddToRequest,
	checkAddressExists,
	asyncHandler(getAddressById)
);

router.patch(
	'/:appealId/addresses/:addressId',
	/*
		#swagger.tags = ['Addresses']
		#swagger.path = '/appeals/{appealId}/addresses/{addressId}'
		#swagger.description = Updates a single address by id
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Address details to update',
			schema: { $ref: '#/definitions/UpdateAddressRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Updates a single address by id',
			schema: { $ref: '#/definitions/UpdateAddressResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	patchAddressValidator,
	checkAppealExistsByIdAndAddToRequest,
	checkAddressExists,
	asyncHandler(updateAddressById)
);

export { router as addressesRoutes };
