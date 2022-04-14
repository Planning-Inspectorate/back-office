import { getAppeals, getAppealDetails, updateAppeal, submitValidationDecision, getLPAList } from './validation.controller.js';
import { param } from 'express-validator';
import asyncHandler from '../middleware/async-handler.js';
import { appealStates } from '../state-machine/transition-state.js';
import { validateAppealStatus, validateAppealAttributesToChange, validateAppealValidationDecision } from './validation.validators.js';

const router = express.Router();

router.get('/',
	/*
		#swagger.description = 'Gets all appeals that need to be validated. The AppealStatus will be either \'new\' or \'incomplete\''
		#swagger.responses[200] = {
			description: 'Appeals that require validation',
			schema: { $ref: '#/definitions/AppealsToValidate' }
		}
	*/
	asyncHandler(getAppeals));

router.get('/lpa-list',
	/* 
		#swagger.description = 'Gets all LPAs from external API'
		#swagger.responses[200] = {
			description: 'All available LPAs',
			schema: [
				'County Durham LPA',
				'Darlington LPA'
			]
		}
	*/
	asyncHandler(getLPAList));

router.get('/:appealId',
	/* 
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
	validateAppealStatus([
		appealStates.received_appeal,
		appealStates.awaiting_validation_info
	]),
	asyncHandler(getAppealDetails));

router.patch('/:appealId',
	/*
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
	body('AppellantName').trim().optional({ nullable: true }),
	param('appealId').toInt(),
	validateAppealAttributesToChange,
	validateAppealStatus([
		appealStates.received_appeal,
		appealStates.awaiting_validation_info
	]),
	asyncHandler(updateAppeal));

router.post('/:appealId',
	/*
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
	validateAppealStatus([
		appealStates.received_appeal,
		appealStates.awaiting_validation_info
	]),
	asyncHandler(submitValidationDecision));

export {
	router as validationRoutes
};
