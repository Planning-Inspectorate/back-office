import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import {
	getSubscription,
	listSubscriptions,
	putSubscription,
	updateSubscription
} from './subscriptions.controller.js';
import {
	validateCreateSubscription,
	validateGetSubscription,
	validateSubscriptionFilters,
	validateUpdateSubscription
} from './subscriptions.validators.js';
import { validatePaginationParameters } from '#middleware/pagination-validation.js';

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

router.get(
	'/list',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/subscriptions/list'
        #swagger.description = 'List subscriptions based on criteria'
        #swagger.parameters['caseReference'] = {
            in: 'query',
            description: 'subscription caseReference',
            schema: { type: 'string' },
            required: false
        }
        #swagger.parameters['type'] = {
            in: 'query',
            description: 'subscription type',
            schema: { type: 'string' },
            required: false
        }
        #swagger.parameters['endAfter'] = {
            in: 'query',
            description: 'subscriptions which end after this date (or have no end date)',
            schema: { type: 'string', format: 'date-time' },
            required: false
        }
        #swagger.parameters['page'] = {
			in: 'query',
			description: 'The page number to return, defaults to 1',
			example: 1,
		}
		#swagger.parameters['pageSize'] = {
			in: 'query',
			description: 'The number of results per page, defaults to 25',
			example: 25,
		}
        #swagger.responses[200] = {
            description: 'Subscription',
            schema: { $ref: '#/definitions/Subscriptions' }
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: { $ref: '#/definitions/SubscriptionsListBadRequest' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
    */
	validatePaginationParameters(),
	validateSubscriptionFilters,
	asyncHandler(listSubscriptions)
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
