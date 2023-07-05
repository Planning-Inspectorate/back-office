import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import {
	getSubscription,
	putSubscription,
	updateSubscription
} from './subscriptions.controller.js';
import {
	validateCreateSubscription,
	validateGetSubscription,
	validateUpdateSubscription
} from './subscriptions.validators.js';

const router = createRouter();

router.get(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/subscriptions'
        #swagger.description = 'Get a subscription'
        #swagger.parameters['caseReference'] = {
            in: 'query',
            description: 'subscription caseReference',
            schema: { type: 'string' },
            required: true
        }
        #swagger.parameters['emailAddress'] = {
            in: 'query',
            description: 'subscription emailAddress',
            schema: { type: 'string' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Subscription',
            schema: { $ref: '#/definitions/Subscription' }
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/SubscriptionGetBadRequest' }
        }
        #swagger.responses[404] = {
            description: 'Not found',
            schema: { $ref: '#/definitions/SubscriptionNotFound' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateGetSubscription,
	asyncHandler(getSubscription)
);

router.put(
	'/',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/subscriptions'
        #swagger.description = 'Create or update a subscription'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'subscription parameters',
            schema: { $ref: '#/definitions/SubscriptionCreateRequest' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Updated subscription',
            schema: { id: {'type': 'number'} }
        }
        #swagger.responses[201] = {
            description: 'Created subscription',
            schema: { id: {'type': 'number'} }
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/SubscriptionCreateBadRequest' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateCreateSubscription,
	asyncHandler(putSubscription)
);

router.patch(
	'/:id',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/subscriptions/{id}'
        #swagger.description = 'Update a subscription'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Subscription ID',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'subscription parameters',
            schema: { $ref: '#/definitions/SubscriptionUpdateRequest' },
            required: true
        }
        #swagger.responses[200] = {
            description: 'Updated subscription',
            schema: { id: {'type': 'number'} }
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/SubscriptionUpdateBadRequest' }
        }
        #swagger.responses[404] = {
            description: 'Not found',
            schema: { $ref: '#/definitions/SubscriptionNotFound' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validateUpdateSubscription,
	asyncHandler(updateSubscription)
);

export { router as subscriptionRoutes };
