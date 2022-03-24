import express from 'express';
import { getValidation,  getAppealToValidate, updateValidation, appealValidated } from './validation.controller.js';
import { body } from 'express-validator';


import asyncHandler from '../middleware/async-handler.js';

const router = express.Router();

router.get('/', 
	/*
		#swagger.description = 'Gets all appeals that need to be validated. The AppealStatus will be either \'new\' or \'incomplete\''
		#swagger.responses[200] = {
			description: 'Appeals that require validation',
			schema: { $ref: '#/definitions/NewAppealToValidate' }
		}
	*/
	asyncHandler(getValidation));
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
			schema: { $ref: '#/definitions/AppealsToValidate' }
		}
	*/
	asyncHandler(getAppealToValidate));
router.patch('/:id', body('AppellantName').isAlpha('en-US', { ignore: ' ' } ), asyncHandler(updateValidation));
router.post('/:id', asyncHandler(appealValidated));


export {
	router as validationRoutes
};
