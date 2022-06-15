import express from 'express';
import { param } from 'express-validator';
import { asyncHandler } from '../../middleware/async-handler.js';
import {
	getAppealDetails,
	getAppeals,
	getLPAList,
	submitValidationDecision,
	updateAppeal
} from './validation.controller.js';
import {
	validateAppealAttributesToChange,
	validateAppealBelongsToValidation,
	validateAppealValidationDecision
} from './validation.validators.js';

const router = new express.Router();

/**
 * @typedef {object} AppealParams
 * @property {number} appealId
 */

router.get(
	'/',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/validation/'
		#swagger.description = 'Gets all appeals that need to be validated. The AppealStatus will be either \'new\' or \'incomplete\''
		#swagger.responses[200] = {
			description: 'Appeals that require validation',
			schema: { $ref: '#/definitions/AppealsToValidate' }
		}
	*/
	asyncHandler(getAppeals)
);

router.get(
	'/lpa-list',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/validation/lpa-list'
		#swagger.description = 'Gets all LPAs from external API'
		#swagger.responses[200] = {
			description: 'All available LPAs',
			schema: [
				'County Durham LPA',
				'Darlington LPA'
			]
		}
	*/
	asyncHandler(getLPAList)
);

router.get(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/validation/:appealId'
		#swagger.description = 'Gets appeal to be validated by the Validation Officer'
		#swagger.parameters['id'] = {
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
		#swagger.responses[200] = {
			desciption: 'Appeal that requires validation',
			schema: { $ref: '#/definitions/AppealToValidate' }
		}
	*/
	param('appealId').toInt(),
	validateAppealBelongsToValidation,
	asyncHandler(getAppealDetails)
);

router.patch(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/validation/:appealId'
		#swagger.description = 'Updates appeal details'
		#swagger.parameters['id'] = {
			in: 'url',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['obj'] = {
			in: 'body',
			description: 'New Details',
			schema: { $ref: "#/definitions/ChangeAppeal" }
		}
	*/
	param('appealId').toInt(),
	validateAppealAttributesToChange,
	validateAppealBelongsToValidation,
	asyncHandler(updateAppeal)
);

router.post(
	'/:appealId',
	/*
		#swagger.tags = ['Appeals']
		#swagger.path = '/appeals/validation/:appealId'
		#swagger.description = 'Sends validation decision'
		#swagger.parameters['id'] = {
			id: 'url',
			description: 'Appeal ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['obj'] = {
			in: 'body',
			description: 'Validation Decision',
			schema: { $ref: "#/definitions/ValidationDecision" }
		}
	*/
	param('appealId').toInt(),
	validateAppealValidationDecision,
	validateAppealBelongsToValidation,
	asyncHandler(submitValidationDecision)
);

export { router as validationRoutes };
