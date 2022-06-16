import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplications } from './case-officer-admin.controller.js';

const router = new express.Router();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/case-officer-admin'
        #swagger.description = 'Gets all applications associated with case officer admin'
        #swagger.responses[200] = {
            description: 'List of applications assigned to case officer',
            schema: { $ref: '#/definitions/ApplicationsForCaseOfficerAdmin' }
        }
    */
	asyncHandler(getApplications)
);

export { router as caseOfficerAdminRoutes };
