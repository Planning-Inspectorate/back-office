import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { getApplications } from './case-admin-officer.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/case-admin-officer'
        #swagger.description = 'Gets all applications associated with case team admin'
        #swagger.responses[200] = {
            description: 'List of applications assigned to case team',
            schema: { $ref: '#/definitions/ApplicationSummaryMany' }
        }
    */
	asyncHandler(getApplications)
);

export { router as caseAdminOfficerRoutes };
