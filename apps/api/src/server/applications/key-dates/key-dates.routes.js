import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { validateApplicationId } from '../application/application.validators.js';
import { getKeyDates, updateKeyDates } from './key-dates.controller.js';
import { validateUpdateKeyDates } from './key-dates.validators.js';

const router = createRouter();

router.get(
	'/:id/key-dates',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/key-dates'
        #swagger.description = 'Gets the Key Dates for an NSIP Application'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application case ID',
			required: true,
			type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'List of Key Dates',
            schema: { $ref: '#/definitions/ApplicationKeyDates' }
        }
    */
	validateApplicationId,
	asyncHandler(getKeyDates)
);

router.patch(
	'/:id/key-dates',
	/*
        #swagger.tags = ['Applications']
        #swagger.path = '/applications/{id}/key-dates'
        #swagger.description = 'Updates the key dates for an NSIP Application. Only the provided sections will be updated.'
        #swagger.parameters['id'] = {
            in: 'path',
			description: 'Application ID',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Key Dates update parameters',
			schema: { $ref: '#/definitions/ApplicationKeyDates' },
			required: true
		}
        #swagger.responses[200] = {
            description: 'New updated Key Dates for the entire project',
            schema: { $ref: '#/definitions/ApplicationKeyDates' }
        }
      #swagger.responses[404] = {
            description: 'Error: Not Found',
			schema: { errors: { id: "Must be an existing application" } }
        }
    */
	validateApplicationId,
	validateUpdateKeyDates,
	// We can't add this validation here because of this bug: https://github.com/express-validator/express-validator/issues/1048
	// null needs to be an explicit value for clearing key dates. We do explicit removal of parameters at the mapping layer.
	// trimUnexpectedRequestParameters,
	// @ts-ignore
	asyncHandler(updateKeyDates)
);

export { router as keyDatesRoutes };
