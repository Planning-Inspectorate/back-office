import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { createSiteVisit, getSiteVisitById, updateSiteVisit } from './site-visits.controller.js';
import checkLookupValueIsValidAndAddToRequest from '#middleware/check-lookup-value-is-valid-and-add-to-request.js';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import {
	getSiteVisitValidator,
	patchSiteVisitValidator,
	postSiteVisitValidator
} from './site-visits.validators.js';
import { ERROR_INVALID_SITE_VISIT_TYPE } from '#endpoints/constants.js';
import { checkSiteVisitExists } from './site-visits.service.js';

const router = createRouter();

router.post(
	'/:appealId/site-visits',
	/*
		#swagger.tags = ['Site Visits']
		#swagger.path = '/appeals/{appealId}/site-visits'
		#swagger.description = 'Creates a single site visit'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Site visit details to create',
			schema: { $ref: '#/definitions/CreateSiteVisitRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Creates a single site visit',
			schema: { $ref: '#/definitions/CreateSiteVisitResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[500] = {}
	 */
	postSiteVisitValidator,
	checkAppealExistsAndAddToRequest,
	checkLookupValueIsValidAndAddToRequest(
		'visitType',
		'siteVisitType',
		ERROR_INVALID_SITE_VISIT_TYPE
	),
	asyncHandler(createSiteVisit)
);

router.get(
	'/:appealId/site-visits/:siteVisitId',
	/*
		#swagger.tags = ['Site Visits']
		#swagger.path = '/appeals/{appealId}/site-visits/{siteVisitId}'
		#swagger.description = 'Gets a single site visit by id'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'Gets a single site visit by id',
			schema: { $ref: '#/definitions/SingleSiteVisitResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[500] = {}
	 */
	getSiteVisitValidator,
	checkAppealExistsAndAddToRequest,
	checkSiteVisitExists,
	asyncHandler(getSiteVisitById)
);

router.patch(
	'/:appealId/site-visits/:siteVisitId',
	/*
		#swagger.tags = ['Site Visits']
		#swagger.path = '/appeals/{appealId}/site-visits/{siteVisitId}'
		#swagger.description = 'Updates a single site visit by id'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Site visit details to create',
			schema: { $ref: '#/definitions/UpdateSiteVisitRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Creates a single site visit by id',
			schema: { $ref: '#/definitions/UpdateSiteVisitResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[500] = {}
	 */
	patchSiteVisitValidator,
	checkAppealExistsAndAddToRequest,
	checkSiteVisitExists,
	checkLookupValueIsValidAndAddToRequest(
		'visitType',
		'siteVisitType',
		ERROR_INVALID_SITE_VISIT_TYPE
	),
	asyncHandler(updateSiteVisit)
);

export { router as siteVisitRoutes };
