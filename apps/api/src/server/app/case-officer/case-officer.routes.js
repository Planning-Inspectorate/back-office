import express from 'express';
import { param } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';
import {
	confirmLPAQuestionnaire,
	getAppealDetails,
	getAppeals,
	updateAppealDetails
} from './case-officer.controller.js';
import {
	validateAppealBelongsToCaseOfficer,
	validateAppealDetails,
	validateAppealHasIncompleteQuestionnaire,
	validateReviewRequest
} from './case-officer.validators.js';

/**
 * @typedef {object} AppealParams
 * @property {number} appealId
 */

const router = express.Router();

router.get(
	'/',
	/*
		 #swagger.description = 'Gets all appeals for a Case Officer to review'
		 #swagger.responses[200] = {
			 description: 'Appeals the require Case Officer to check',
			 schema: { $ref: '#/definitions/AppealsForCaseOfficer' }
		 }
	 */
	asyncHandler(getAppeals)
);

router.get(
	'/:appealId',
	/*
		 #swagger.description = 'Gets appeal details for Case Officer to review'
		 #swagger.responses[200] = {
			 description: 'Appeal that requires a Case Officer to check over',
			 schema: { $ref: '#/definitions/AppealForCaseOfficer' }
		 }
	 */
	param('appealId').toInt(),
	validateAppealBelongsToCaseOfficer,
	asyncHandler(getAppealDetails)
);

router.patch(
	'/:appealId',
	param('appealId').toInt(),
	validateAppealHasIncompleteQuestionnaire,
	validateAppealDetails,
	asyncHandler(updateAppealDetails)
);

router.post(
	'/:appealId/confirm',
	param('appealId').toInt(),
	validateAppealBelongsToCaseOfficer,
	validateReviewRequest,
	asyncHandler(confirmLPAQuestionnaire)
);

export { router as caseOfficerRoutes };
