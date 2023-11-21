import { Router as createRouter } from 'express';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import { postInspectorDecision } from './appeal-decision.controller.js';
import {
	getOutcomeValidator,
	getDateValidator,
	getDocumentValidator
} from './appeal-decision.validator.js';
import { validateDecisionDocumentAndAddToRequest } from './appeal-decision.middleware.js';
import { asyncHandler } from '#middleware/async-handler.js';

const router = createRouter();

router.post(
	'/:appealId/inspector-decision',
	/*
		#swagger.tags = ['Inspector Decision']
		#swagger.path = '/appeals/{appealId}/inspector-decision'
		#swagger.description = Closes an appeal by setting the inspector decision
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Decision info',
			schema: { $ref: '#/definitions/DecisionInfo' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Gets the decision info or null',
			schema: { $ref: '#/definitions/DecisionInfo' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	checkAppealExistsAndAddToRequest,
	getOutcomeValidator,
	getDateValidator,
	getDocumentValidator,
	validateDecisionDocumentAndAddToRequest,
	asyncHandler(postInspectorDecision)
);

export { router as appealsDecisionRoutes };
