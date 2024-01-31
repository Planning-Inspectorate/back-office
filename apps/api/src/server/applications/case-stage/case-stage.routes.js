import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { getCaseStages } from './case-stage.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/case-stage'
        #swagger.description = 'Gets all possible stages for a case'
        #swagger.responses[200] = {
            description: 'List of stages for a case',
            schema: { $ref: '#/definitions/CaseStages' }
        }
		#swagger.parameters['x-service-name'] = {
			in: 'header',
			type: 'string',
			description: 'Service name header',
			default: 'swagger'
		}
		#swagger.parameters['x-api-key'] = {
			in: 'header',
			type: 'string',
			description: 'API key header',
			default: '123'
		}
    */
	asyncHandler(getCaseStages)
);

export { router as caseStageRoutes };
