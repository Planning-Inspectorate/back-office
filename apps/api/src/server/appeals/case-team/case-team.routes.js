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
} from './case-team.controller.js';
import {
	validateAppealBelongsToCaseTeam,
	validateAppealDetails,
	validateAppealHasIncompleteQuestionnaire,
	validateFilesUpload,
	validateReviewRequest
} from './case-team.validators.js';

/**
 * @typedef {object} AppealParams
 * @property {number} appealId
 */

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-team'
		#swagger.description = 'Gets all appeals for a Case team to review'
		#swagger.responses[200] = {
			description: 'Appeals the require Case team to check',
			schema: { $ref: '#/definitions/AppealsForCaseTeam' }
		}
	 */
	asyncHandler(getAppeals)
);

router.get(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-team/{appealId}'
		#swagger.description = 'Gets appeal details for Case team to review'
		#swagger.parameters['appealId'] = {
			id: 'path',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
		#swagger.responses[200] = {
			description: 'Appeal that requires a Case team to check over',
			schema: { $ref: '#/definitions/AppealForCaseTeam' }
		}
	 */
	param('appealId').toInt(),
	validateAppealBelongsToCaseTeam,
	asyncHandler(getAppealDetails)
);

router.patch(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-team/{appealId}'
		#swagger.description = 'Updates appeal details'
		#swagger.parameters['appealId'] = {
			id: 'path',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Details to update',
			schema: { $ref: '#/definitions/UpdateAppealDetailsByCaseTeam' },
            required: true
		}
		#swagger.responses[200] = {
			description: 'Appeal after new details were sent over',
			schema: { $ref: '#/definitions/AppealAfterUpdateForCaseTeam' }
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
		#swagger.path = '/appeals/case-team/{appealId}/confirm'
		#swagger.description = 'Updates appeal details'
		#swagger.parameters['appealId'] = {
			id: 'path',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Details to update',
			schema: { $ref: '#/definitions/SendLPAQuestionnaireConfirmation' },
            required: true
		}
	*/
	param('appealId').toInt(),
	validateAppealBelongsToCaseTeam,
	validateReviewRequest,
	asyncHandler(confirmLPAQuestionnaire)
);

router.get(
	'/:appealId/statements-comments',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/case-team/{appealId}/statements-comments'
		#swagger.description = 'Gets appeal details when uploading statements and final comments'
		#swagger.parameters['appealId'] = {
			id: 'path',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
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
		#swagger.path = '/appeals/case-team/{appealId}/statement'
        #swagger.description = 'Uploads statement'
		#swagger.parameters['appealId'] = {
			id: 'path',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
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
		#swagger.path = '/appeals/case-team/{appealId}/final-comment'
        #swagger.description = 'Uploads final comment'
		#swagger.parameters['appealId'] = {
			id: 'path',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
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

export { router as CaseTeamRoutes };
