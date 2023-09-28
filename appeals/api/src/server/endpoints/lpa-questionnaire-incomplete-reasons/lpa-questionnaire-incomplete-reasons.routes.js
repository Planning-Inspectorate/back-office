import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/lpa-questionnaire-incomplete-reasons',
	/*
		#swagger.tags = ['LPA Questionnaire Incomplete Reasons']
		#swagger.path = '/appeals/lpa-questionnaire-incomplete-reasons'
		#swagger.description = 'Gets LPA questionnaire incomplete reasons'
		#swagger.parameters['azureAdUserId'] = {
			in: 'header',
			required: true,
			example: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		}
		#swagger.responses[200] = {
			description: 'LPA questionnaire incomplete reasons',
			schema: { $ref: '#/definitions/AllLPAQuestionnaireIncompleteReasonsResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('lPAQuestionnaireIncompleteReason'))
);

export { router as lpaQuestionnaireIncompleteReasonsRoutes };
