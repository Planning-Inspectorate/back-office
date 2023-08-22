import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
	getLpaQuestionnaireById,
	updateLPAQuestionnaireById
} from './lpa-questionnaires.controller.js';
import checkLookupValueIsValidAndAddToRequest from '#middleware/check-lookup-value-is-valid-and-add-to-request.js';
import checkLookupValuesAreValid from '#middleware/check-lookup-values-are-valid.js';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import { checkLPAQuestionnaireExists } from './lpa-questionnaires.service.js';
import {
	getLPAQuestionnaireValidator,
	patchLPAQuestionnaireValidator
} from './lpa-questionnaires.validators.js';
import { ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME } from '../constants.js';

const router = createRouter();

router.get(
	'/:appealId/lpa-questionnaires/:lpaQuestionnaireId',
	/*
		#swagger.tags = ['LPA Questionnaires']
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
		#swagger.tags = ['LPA Questionnaires']
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
	checkLookupValueIsValidAndAddToRequest(
		'validationOutcome',
		'lPAQuestionnaireValidationOutcome',
		ERROR_INVALID_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
	),
	checkLookupValuesAreValid('incompleteReasons', 'lPAQuestionnaireIncompleteReason'),
	checkLookupValuesAreValid('designatedSites', 'designatedSite'),
	checkLookupValuesAreValid('scheduleType', 'scheduleType'),
	asyncHandler(updateLPAQuestionnaireById)
);

export { router as lpaQuestionnairesRoutes };
