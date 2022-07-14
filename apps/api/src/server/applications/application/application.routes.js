import express from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { createApplication } from './application.controller.js';
import { validateCreateApplication } from './application.validators.js';

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
	validateCreateApplication,
	asyncHandler(createApplication)
);

export { router as applicationRoutes };
