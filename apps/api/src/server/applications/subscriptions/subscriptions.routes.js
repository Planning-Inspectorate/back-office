import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { createSubscription } from './subscriptions.controller.js';
import { validateCreateSubscription } from './subscriptions.validators.js';

const router = createRouter();

router.post(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/subscriptions'
        #swagger.description = 'Create a subscription'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'subscription parameters',
            schema: { $ref: '#/definitions/SubscriptionCreateRequest' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Created subscription',
            schema: { id: {'type': 'number'} }
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/SubscriptionCreateBadRequest' }
        }
    */
	validateCreateSubscription,
	asyncHandler(createSubscription)
);

export { router as subscriptionRoutes };
