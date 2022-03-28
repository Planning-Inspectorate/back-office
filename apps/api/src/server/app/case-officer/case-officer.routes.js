import express from 'express';
import asyncHandler from '../middleware/async-handler.js';
import { getAppeals, getAppealDetails, confirmingLPAQuestionnaire } from './case-officer.controller.js';

const router = express.Router();

router.get('/', 
	/*
		#swagger.description = 'Gets all appeals for a Case Officer to review'
		#swagger.responses[200] = {
			description: 'Appeals the require Case Officer to check',
			schema: { $ref: '#/definitions/AppealsForCaseOfficer' }
		}
	*/
	asyncHandler(getAppeals));
router.get('/:id', 
	/*
		#swagger.description = 'Gets appeal details for Case Officer to review'
		#swagger.responses[200] = {
			description: 'Appeal that requires a Case Officer to check over',
			schema: { $ref: '#/definitions/AppealForCaseOfficer' }
		}
	*/
	asyncHandler(getAppealDetails));
router.post('/:id/confirm', asyncHandler(confirmingLPAQuestionnaire));


export {
	router as caseOfficerRoutes
};
