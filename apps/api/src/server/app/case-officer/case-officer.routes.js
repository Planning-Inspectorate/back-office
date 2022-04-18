import express from 'express';
import { param } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';
import { getAppeals, getAppealDetails, confirmLPAQuestionnaire } from './case-officer.controller.js';
import { validateAppealStatus } from '../middleware/validate-appeal-status.js';
import { appealStates } from '../state-machine/transition-state.js';
import { validateReviewRequest } from './case-officer.validators.js';

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
router.get('/:appealId', 
	/*
		#swagger.description = 'Gets appeal details for Case Officer to review'
		#swagger.responses[200] = {
			description: 'Appeal that requires a Case Officer to check over',
			schema: { $ref: '#/definitions/AppealForCaseOfficer' }
		}
	*/
	param('appealId').toInt(),
	validateAppealStatus([
		appealStates.received_lpa_questionnaire,
		appealStates.incomplete_lpa_questionnaire
	]),
	asyncHandler(getAppealDetails));
router.post('/:appealId/confirm', 
	param('appealId').toInt(),
	validateAppealStatus([
		appealStates.received_lpa_questionnaire,
		appealStates.incomplete_lpa_questionnaire
	]),
	validateReviewRequest,
	asyncHandler(confirmLPAQuestionnaire));


export {
	router as caseOfficerRoutes
};
