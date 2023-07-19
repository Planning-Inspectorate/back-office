import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getAppellantCaseById, updateAppellantCaseById } from './appellant-cases.controller.js';
import checkLookupValueIsValidAndAddToRequest from '#middleware/check-lookup-value-is-valid-and-add-to-request.js';
import checkLookupValuesAreValid from '#middleware/check-lookup-values-are-valid.js';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import { checkAppellantCaseExists } from './appellant-cases.service.js';
import {
	getAppellantCaseValidator,
	patchAppellantCaseValidator
} from './appellant-cases.validators.js';
import { ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME } from '../constants.js';

const router = createRouter();

router.get(
	'/:appealId/appellant-cases/:appellantCaseId',
	/*
		#swagger.tags = ['Appellant Cases']
		#swagger.path = '/appeals/{appealId}/appellant-cases/{appellantCaseId}'
		#swagger.description = Gets a single appellant case for an appeal by id
		#swagger.responses[200] = {
			description: 'Gets a single appellant case for an appeal by id',
			schema: { $ref: '#/definitions/SingleAppellantCaseResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppellantCaseValidator,
	checkAppealExistsAndAddToRequest,
	checkAppellantCaseExists,
	asyncHandler(getAppellantCaseById)
);

router.patch(
	'/:appealId/appellant-cases/:appellantCaseId',
	/*
		#swagger.tags = ['Appellant Cases']
		#swagger.path = '/appeals/{appealId}/appellant-cases/{appellantCaseId}'
		#swagger.description = Updates a single appellant case for an appeal by id
		#swagger.requestBody = {
			in: 'body',
			description: 'Appellant case details to update',
			schema: { $ref: '#/definitions/UpdateAppellantCaseRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Updates a single appeal by id',
			schema: { $ref: '#/definitions/UpdateAppellantCaseResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	patchAppellantCaseValidator,
	checkAppealExistsAndAddToRequest,
	checkAppellantCaseExists,
	checkLookupValueIsValidAndAddToRequest(
		'validationOutcome',
		'appellantCaseValidationOutcome',
		ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME
	),
	checkLookupValuesAreValid('incompleteReasons', 'appellantCaseIncompleteReason'),
	checkLookupValuesAreValid('invalidReasons', 'appellantCaseInvalidReason'),
	asyncHandler(updateAppellantCaseById)
);

export { router as appellantCasesRoutes };
