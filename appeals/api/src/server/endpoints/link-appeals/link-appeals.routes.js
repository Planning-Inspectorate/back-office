import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import {
	postLinkAppealValidator,
	postLinkLegacyAppealValidator
} from './link-appeals.validators.js';
import {
	linkAppeal,
	linkExternalAppeal,
	associateAppeal,
	associateExternalAppeal,
	unlinkAppeal
} from './link-appeals.controller.js';

const router = createRouter();

router.post(
	'/:appealId/link-appeal',
	/*
		#swagger.tags = ['Linked Appeals']
		#swagger.path = '/appeals/{appealId}/link-appeal'
		#swagger.description = 'Links an appeal to the current appeal'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Linked Appeal Request',
			schema: { $ref: '#/definitions/LinkedAppealRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	checkAppealExistsAndAddToRequest,
	postLinkAppealValidator,
	asyncHandler(linkAppeal)
);

router.post(
	'/:appealId/link-legacy-appeal',
	/*
		#swagger.tags = ['Linked Appeals']
		#swagger.path = '/appeals/{appealId}/link-legacy-appeal'
		#swagger.description = 'Links a legacy appeal (on Horizon) to the current appeal'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Linked Appeal Request (legacy)',
			schema: { $ref: '#/definitions/LinkedAppealLegacyRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	checkAppealExistsAndAddToRequest,
	postLinkLegacyAppealValidator,
	asyncHandler(linkExternalAppeal)
);

router.post(
	'/:appealId/associate-appeal',
	/*
		#swagger.tags = ['Linked Appeals']
		#swagger.path = '/appeals/{appealId}/associate-appeal'
		#swagger.description = 'Associate an appeal to the current appeal, as related'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Related Appeal Request',
			schema: { $ref: '#/definitions/RelatedAppealRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	checkAppealExistsAndAddToRequest,
	postLinkAppealValidator,
	asyncHandler(associateAppeal)
);

router.post(
	'/:appealId/associate-legacy-appeal',
	/*
		#swagger.tags = ['Linked Appeals']
		#swagger.path = '/appeals/{appealId}/associate-legacy-appeal'
		#swagger.description = 'Links a legacy appeal (on Horizon) to the current appeal'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Related Appeal Request (legacy)',
			schema: { $ref: '#/definitions/RelatedAppealLegacyRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	checkAppealExistsAndAddToRequest,
	postLinkLegacyAppealValidator,
	asyncHandler(associateExternalAppeal)
);

router.delete(
	'/:appealId/unlink-appeal',
	/*
		#swagger.tags = ['Linked Appeals']
		#swagger.path = '/appeals/{appealId}/unlink-appeal'
		#swagger.description = 'Remove an appeal relationship by ID'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Unlink Appeal Request',
			schema: { $ref: '#/definitions/UnlinkAppealRequest' },
			required: true
		}
		#swagger.responses[400] = {}
	 */
	checkAppealExistsAndAddToRequest,
	asyncHandler(unlinkAppeal)
);

export { router as linkAppealsRoutes };
