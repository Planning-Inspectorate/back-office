import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
	getAppealById,
	getAppeals,
	getAppellantCaseById,
	getLpaQuestionnaireById,
	updateAppealById,
	updateAppellantCaseById,
	updateLPAQuestionnaireById
} from './appeals.controller.js';
import {
	checkAppealExistsAndAddToRequest,
	checkAppellantCaseExists,
	checkLookupValuesAreValid,
	checkLPAQuestionnaireExists,
	checkValidationOutcomeExistsAndAddToRequest
} from './appeals.service.js';
import {
	getAppealsValidator,
	getAppealValidator,
	getAppellantCaseValidator,
	getLPAQuestionnaireValidator,
	patchAppealValidator,
	patchAppellantCaseValidator,
	patchLPAQuestionnaireValidator
} from './appeals.validators.js';
import {
	ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME,
	ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
} from '../constants.js';

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals'
		#swagger.description = 'Gets requested appeals, limited to the first 30 appeals if no pagination params are given'
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
		#swagger.responses[200] = {
			description: 'Requested appeals',
			schema: { $ref: '#/definitions/AllAppeals' },
		}
		#swagger.responses[400] = {}
	 */
	getAppealsValidator,
	asyncHandler(getAppeals)
);

router.get(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}'
		#swagger.description = Gets a single appeal by id
		#swagger.responses[200] = {
			description: 'Gets a single appeal by id',
			schema: { $ref: '#/definitions/SingleAppealResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getAppealValidator,
	checkAppealExistsAndAddToRequest,
	asyncHandler(getAppealById)
);

router.patch(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}'
		#swagger.description = 'Updates a single appeal by id'
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
	checkAppealExistsAndAddToRequest,
	asyncHandler(updateAppealById)
);

router.get(
	'/:appealId/lpa-questionnaires/:lpaQuestionnaireId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}/lpa-questionnaires/{lpaQuestionnaireId}'
		#swagger.description = Gets a single LPA questionnaire for an appeal by id
		#swagger.responses[200] = {
			description: 'Gets a single LPA questionnaire for an appeal by id',
			schema: { $ref: '#/definitions/SingleLPAQuestionnaireResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	getLPAQuestionnaireValidator,
	checkAppealExistsAndAddToRequest,
	checkLPAQuestionnaireExists,
	asyncHandler(getLpaQuestionnaireById)
);

router.patch(
	'/:appealId/lpa-questionnaires/:lpaQuestionnaireId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/{appealId}/lpa-questionnaires/{lpaQuestionnaireId}'
		#swagger.description = Updates a single LPA questionnaire for an appeal by id
		#swagger.requestBody = {
			in: 'body',
			description: 'LPA questionnaire details to update',
			schema: { $ref: '#/definitions/UpdateLPAQuestionnaireRequest' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Updates a single LPA questionnaire by id',
			schema: { $ref: '#/definitions/UpdateLPAQuestionnaireResponse' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	patchLPAQuestionnaireValidator,
	checkAppealExistsAndAddToRequest,
	checkLPAQuestionnaireExists,
	checkValidationOutcomeExistsAndAddToRequest(
		'lPAQuestionnaireValidationOutcome',
		ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
	),
	checkLookupValuesAreValid('incompleteReasons', 'lPAQuestionnaireIncompleteReason'),
	asyncHandler(updateLPAQuestionnaireById)
);

router.get(
	'/:appealId/appellant-cases/:appellantCaseId',
	/*
		#swagger.tags = ['Appeals']
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
		#swagger.tags = ['Appeals']
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
	checkValidationOutcomeExistsAndAddToRequest(
		'appellantCaseValidationOutcome',
		ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME
	),
	checkLookupValuesAreValid('incompleteReasons', 'appellantCaseIncompleteReason'),
	checkLookupValuesAreValid('invalidReasons', 'appellantCaseInvalidReason'),
	asyncHandler(updateAppellantCaseById)
);

export { router as appealsRoutes };
