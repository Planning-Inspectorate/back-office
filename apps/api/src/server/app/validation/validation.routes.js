import express from 'express';
import { getAppeals,  getAppealDetails, updateAppeal, submitValidationDecision } from './validation.controller.js';
import { body } from 'express-validator';


import asyncHandler from '../middleware/async-handler.js';

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

router.get('/:id', 
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
	asyncHandler(getAppealDetails));

router.patch('/:id', 
	body('AppellantName').isAlpha('en-US', { ignore: ' ' } ).optional({ nullable: true }), 
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
	asyncHandler(updateAppeal));

router.post('/:id', 
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
	asyncHandler(submitValidationDecision));


export {
	router as validationRoutes
};
