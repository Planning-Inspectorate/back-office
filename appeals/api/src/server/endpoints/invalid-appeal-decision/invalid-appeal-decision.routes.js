import { Router as createRouter } from 'express';
import checkAppealExistsAndAddToRequest from '#middleware/check-appeal-exists-and-add-to-request.js';
import { postInvalidDecision } from './invalid-appeal-decision.controller.js';
import { getInvalidDecisionReasonValidator } from './invalid-appeal-decision.validator.js';
import { asyncHandler } from '#middleware/async-handler.js';

const router = createRouter();

router.post(
	'/:appealId/inspector-decision-invalid',
	/*
		#swagger.tags = ['Inspector Decision']
		#swagger.path = '/appeals/{appealId}/inspector-decision-invalid'
		#swagger.description = Closes an appeal by setting the inspector decision as Invalid
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.requestBody = {
			in: 'body',
			description: 'Invalid decision info',
			schema: { $ref: '#/definitions/InvalidDecisionInfo' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'Gets the Invalid decision info or null',
			schema: { $ref: '#/definitions/InvalidDecisionInfo' }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	checkAppealExistsAndAddToRequest,
	getInvalidDecisionReasonValidator,
	asyncHandler(postInvalidDecision)
);

export { router as invalidAppealDecisionRoutes };
