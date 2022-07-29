import { Router as createRouter } from 'express';
import { param } from 'express-validator';
import { asyncHandler } from '../../middleware/async-handler.js';
import { validateAppealStatus } from '../../middleware/validate-appeal-status.js';
import { appealStates } from '../../utils/transition-state.js';
import {
	confirmLPAQuestionnaire,
	getAppealDetails,
	getAppealDetailsForStatementsAndComments,
	getAppeals,
	updateAppealDetails,
	uploadFinalComment,
	uploadStatement
} from './case-officer.controller.js';
import {
	validateAppealBelongsToCaseOfficer,
	validateAppealDetails,
	validateAppealHasIncompleteQuestionnaire,
	validateFilesUpload,
	validateReviewRequest
} from './case-officer.validators.js';

/**
 * @typedef {object} AppealParams
 * @property {number} appealId
 */

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-officer'
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
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-officer/:appealId'
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
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-officer/:appealId'
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
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-officer/:appealId/confirm'
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

router.get(
	'/:appealId/statements-comments',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-officer/:appealId/statements-comments'
		#swagger.description = 'Gets appeal details when uploading statements and final comments'
		#swagger.responses[200] = {
			description: 'Appeal details to show when uploading statements and final comments',
			schema: { $ref: '#/definitions/AppealDetailsWhenUploadingStatementsAndFinalComments' }
		}
	*/
	param('appealId').toInt(),
	validateAppealStatus([
		appealStates.available_for_statements,
		appealStates.available_for_final_comments
	]),
	asyncHandler(getAppealDetailsForStatementsAndComments)
);

router.post(
	'/:appealId/statement',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-officer/:appealId/statement'
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
		#swagger.responses[200] = {
			desciption: 'Appeal details',
			schema: { $ref: '#/definition/AppealDetailsAfterStatementUpload' }
		}
	*/
	param('appealId').toInt(),
	validateFilesUpload('statements'),
	validateAppealStatus(['available_for_statements']),
	asyncHandler(uploadStatement)
);

router.post(
	'/:appealId/final-comment',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-officer/:appealId/final-comment'
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
		#swagger.responses[200] = {
			desciption: 'Appeal details',
			schema: { $ref: '#/definition/AppealDetailsAfterFinalCommentUpload' }
		}
	*/
	param('appealId').toInt(),
	validateFilesUpload('finalcomments'),
	validateAppealStatus(['available_for_final_comments']),
	asyncHandler(uploadFinalComment)
);

export { router as caseOfficerRoutes };
