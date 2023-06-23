import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getLookupData } from '../common/controllers/lookup-data.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/lpa-questionnaire-incomplete-reasons'
		#swagger.description = 'Gets LPA questionnaire incomplete reasons'
		#swagger.responses[200] = {
			description: 'LPA questionnaire incomplete reasons',
			schema: { $ref: '#/definitions/AllLPAQuestionnaireIncompleteReasonsResponse' },
		}
		#swagger.responses[400] = {}
	 */
	asyncHandler(getLookupData('lPAQuestionnaireIncompleteReason'))
);

export { router as lpaQuestionnaireIncompleteReasonsRoutes };
