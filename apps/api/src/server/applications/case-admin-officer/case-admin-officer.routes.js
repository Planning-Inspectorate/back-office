import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplications } from './case-admin-officer.controller.js';

const router = new express.Router();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/case-admin-officer'
        #swagger.description = 'Gets all applications associated with case officer admin'
        #swagger.responses[200] = {
            description: 'List of applications assigned to case officer',
            schema: { $ref: '#/definitions/ApplicationsForCaseAdminOfficer' }
        }
    */
	asyncHandler(getApplications)
);

export { router as caseAdminOfficerRoutes };
