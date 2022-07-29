import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplications } from './case-officer.controller.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/case-officer'
        #swagger.description = 'Gets all applications associated with case officer'
        #swagger.responses[200] = {
            description: 'List of applications assigned to case officer',
            schema: { $ref: '#/definitions/ApplicationsForCaseOfficer' }
        }
    */
	asyncHandler(getApplications)
);

export { router as caseOfficerRoutes };
