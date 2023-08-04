import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { createS51Advice, getS51Advice, getManyS51Advices } from './s51-advice.controller.js';
import { validateCreateS51Advice } from './s51-advice.validators.js';
import { validateApplicationId } from '../application/application.validators.js';

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
	'/:id/s51-advice/:adviceId',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice/{adviceId}'
        #swagger.description = 'Application case ID'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.parameters['adviceId'] = {
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
	validateApplicationId,
	asyncHandler(getS51Advice)
);

router.post(
	'/:id/s51-advice',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/s51-advice'
        #swagger.description = 'Gets paginated array of S51 Advice(s) on a case'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'S51 Advice pagination parameters',
			schema: { $ref: '#/definitions/S51AdvicePaginatedRequestBody' },
			required: true
		}
        #swagger.responses[200] = {
            description: 'A paginated data set of S51 Advices and their properties',
            schema: { $ref: '#/definitions/S51AdvicePaginatedResponse' }
        }
		#swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
    */
	validateApplicationId,
	asyncHandler(getManyS51Advices)
);

export { router as s51AdviceRoutes };
