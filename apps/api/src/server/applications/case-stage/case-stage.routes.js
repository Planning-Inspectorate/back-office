import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
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
    */
	asyncHandler(getCaseStages)
);

export { router as caseStageRoutes };
