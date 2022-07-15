import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { createApplication, updateApplication } from './application.controller.js';
import {
	validateApplicantId,
	validateApplicationId,
	validateCreateUpdateApplication
} from './application.validators.js';

const router = new express.Router();

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications'
        #swagger.description = 'Creates new application'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Application Details',
            schema: { $ref: '#/definitions/CreateApplication' }
        }
        #swagger.responses[200] = {
            description: 'ID of application',
            schema: { id: 1 }
        }
    */
	validateCreateUpdateApplication,
	asyncHandler(createApplication)
);

router.patch(
	'/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/:id'
        #swagger.description = 'Updates application'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Application Details',
            schema: { $ref: '#/definitions/UpdateApplication' }
        }
        #swagger.responses[200] = {
            description: 'ID of application',
            schema: { id: 1 }
        }
    */
	validateApplicationId,
	validateApplicantId,
	validateCreateUpdateApplication,
	asyncHandler(updateApplication)
);

export { router as applicationRoutes };
