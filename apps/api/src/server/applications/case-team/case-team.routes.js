import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplications } from './case-team.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/case-team'
        #swagger.description = 'Gets all applications associated with Case team'
        #swagger.responses[200] = {
            description: 'List of applications assigned to Case team',
            schema: { $ref: '#/definitions/ApplicationsForCaseTeam' }
        }
    */
	asyncHandler(getApplications)
);

export { router as caseTeamRoutes };
