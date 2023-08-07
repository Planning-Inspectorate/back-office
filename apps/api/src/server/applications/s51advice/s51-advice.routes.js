import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { createS51Advice, getS51Advice } from './s51-advice.controller.js';
import { validateCreateS51Advice } from './s51-advice.validators.js';

const router = createRouter();

router.post(
	'/s51-advice',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/s51-advice'
        #swagger.description = 'Create an S51 advice for the case'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Payload to create S51 advice',
            schema: { $ref: '#/definitions/S51AdviceRequestBody' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Created S51 advice',
            schema: { $ref: '#/definitions/S51AdviceResponseBody' }
        }
    */
	validateCreateS51Advice,
	asyncHandler(createS51Advice)
);

router.get(
	'/:caseId/s51-advice/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/s51-advice/{id}'
        #swagger.description = 'Application case ID'
        #swagger.parameters['caseId'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'S51 advice ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'List of examination timetable items',
            schema: { $ref: '#/definitions/S51AdviceResponseBody' }
        }
    */
	asyncHandler(getS51Advice)
);

export { router as s51AdviceRoutes };
