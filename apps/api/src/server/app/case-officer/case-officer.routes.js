import express from 'express';
import { param } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';
import {
	confirmLPAQuestionnaire,
	getAppealDetails,
	getAppeals,
	updateAppealDetails,
	uploadStatement,
	uploadFinalComment,
	getAppealDetailsForStatementsAndComments
} from './case-officer.controller.js';
import {
	validateAppealBelongsToCaseOfficer,
	validateAppealDetails,
	validateAppealHasIncompleteQuestionnaire,
	validateReviewRequest,
	validateFilesUpload
} from './case-officer.validators.js';
import { validateAppealStatus } from '../middleware/validate-appeal-status.js';
import { appealStates } from '../state-machine/transition-state.js';

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
	/*
		#swagger.description = 'Updates appeal details'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Details to update',
			schema: { $ref: '#/definitions/UpdateAppealDetailsByCaseOfficer' },
            required: true
		}
		#swagger.responses[200] = {
			description: 'Appeal after new details were sent over',
			schema: { $ref: '#/definitions/AppealAfterUpdateForCaseOfficer' }
		}
	*/
	param('appealId').toInt(),
	validateAppealHasIncompleteQuestionnaire,
	validateAppealDetails,
	asyncHandler(updateAppealDetails)
);

router.post(
	'/:appealId/confirm',
	/*
		#swagger.description = 'Updates appeal details'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Details to update',
			schema: { $ref: '#/definitions/SendLPAQuestionnaireConfirmation' },
            required: true
		}
	*/
	param('appealId').toInt(),
	validateAppealBelongsToCaseOfficer,
	validateReviewRequest,
	asyncHandler(confirmLPAQuestionnaire)
);

router.get('/:appealId/statements-comments',
	/*
		#swagger.description = 'Gets appeal details when uploading statements and final comments'
		#swagger.responses[200] = {
			description: 'Appeal details to show when uploading statements and final comments',
			schema: { $ref: '#/definitions/AppealDetailsWhenUploadingStatementsAndFinalComments' }
		}
	*/
	param('appealId').toInt(),
	validateAppealStatus([appealStates.available_for_statements, appealStates.available_for_final_comments]),
	asyncHandler(getAppealDetailsForStatementsAndComments));

router.post('/:appealId/statement',
	/*
        #swagger.description = 'Uploads statement'
        #swagger.parameters['userId'] = {
            in: 'header',
            type: 'string',
            required: true
        }
        #swagger.parameters['formData'] = {
			in: 'formData',
			description: 'Statement upload payload',
			schema: { $ref: "#/definitions/UploadStatement" },
            required: true
		}
	*/
	param('appealId').toInt(),
	validateFilesUpload('statements'),
	validateAppealStatus(['available_for_statements']),
	asyncHandler(uploadStatement));

router.post('/:appealId/final-comment',
/*
        #swagger.description = 'Uploads final comment'
        #swagger.parameters['userId'] = {
            in: 'header',
            type: 'string',
            required: true
        }
        #swagger.parameters['formData'] = {
			in: 'formData',
			description: 'Final comment upload payload',
			schema: { $ref: "#/definitions/UploadFinalComment" },
            required: true
		}
	*/
	param('appealId').toInt(),
	validateFilesUpload('finalcomments'),
	validateAppealStatus(['available_for_final_comments']),
	asyncHandler(uploadFinalComment));

export {
	router as caseOfficerRoutes
};
