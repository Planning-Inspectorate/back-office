import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { getApplications } from './case-officer.controller.js';

const router = new express.Router();

router.get(
    '/',
    /*
        #swagger.description = 'Gets all applications associated with case officer'
        #swagger.desponses[200] = {
            description: 'List of applications assigned to case officer'
        }
    */
    asyncHandler(getApplications)
)

export { router as caseOfficerRoutes }
