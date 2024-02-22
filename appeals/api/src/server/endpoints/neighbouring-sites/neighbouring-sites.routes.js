import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import {
	addNeighbouringSite,
	updateNeighbouringSite,
	removeNeighbouringSite
} from './neighbouring-sites.controller.js';
import { checkAppealExistsByIdAndAddToRequest } from '#middleware/check-appeal-exists-and-add-to-request.js';
import {
	createNeighbouringSiteValidator,
	updateNeighbouringSiteValidator,
	deleteNeighbouringSiteValidator
} from './neighbouring-sites.validators.js';

const router = createRouter();

router.post(
	'/:appealId/neighbouring-sites',
	/*
		#swagger.tags = ['Neighbouring sites']
		#swagger.path = '/appeals/{appealId}/neighbouring-sites'
		#swagger.description = Adds a neighbouring site with an address to an existing appeal
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'An address',
			schema: { $ref: '#/definitions/UpdateAddressRequest' },
			required: true
		}
		#swagger.responses[400] = {}
		#swagger.responses[200] = {
			description: 'Returns the siteId',
			schema: { $ref: '#/definitions/NeighbouringSiteCreateResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	checkAppealExistsByIdAndAddToRequest,
	createNeighbouringSiteValidator,
	asyncHandler(addNeighbouringSite)
);

router.patch(
	'/:appealId/neighbouring-sites',
	/*
		#swagger.tags = ['Neighbouring sites']
		#swagger.path = '/appeals/{appealId}/neighbouring-sites'
		#swagger.description = Updates a neighbouring site from its id
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'An address',
			schema: { $ref: '#/definitions/NeighbouringSiteUpdateRequest' },
			required: true
		}
		#swagger.responses[400] = {}
		#swagger.responses[200] = {
			description: 'Returns the siteId',
			schema: { $ref: '#/definitions/NeighbouringSiteUpdateResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	checkAppealExistsByIdAndAddToRequest,
	updateNeighbouringSiteValidator,
	asyncHandler(updateNeighbouringSite)
);

router.delete(
	'/:appealId/neighbouring-sites',
	/*
		#swagger.tags = ['Neighbouring sites']
		#swagger.path = '/appeals/{appealId}/neighbouring-sites'
		#swagger.description = Deletes a neighbouring from its id
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'The id of the neighbouring site to delete',
			schema: { $ref: '#/definitions/NeighbouringSiteDeleteRequest' },
			required: true
		}
		#swagger.responses[400] = {}
		#swagger.responses[200] = {
			description: 'Returns the siteId',
			schema: { $ref: '#/definitions/NeighbouringSiteUpdateResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	checkAppealExistsByIdAndAddToRequest,
	deleteNeighbouringSiteValidator,
	asyncHandler(removeNeighbouringSite)
);

export { router as neighbouringSitesRoutes };
