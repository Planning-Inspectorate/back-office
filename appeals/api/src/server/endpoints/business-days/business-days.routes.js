import { Router as createRouter } from 'express';
import { asyncHandler } from '#middleware/async-handler.js';
import { composeMiddleware } from '@pins/express';
import { validationErrorHandler } from '#middleware/error-handler.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import { validate } from './business-days.controller.js';

const router = createRouter();

router.post(
	'/validate-business-date',
	/*
		#swagger.tags = ['Utilities']
		#swagger.path = '/appeals/validate-business-date'
		#swagger.description = Validates a date to ensure is a business day
		#swagger.requestBody = {
			in: 'body',
			description: 'Date to validate',
			schema: { $ref: '#/definitions/ValidateDate' },
			required: true
		}
		#swagger.responses[200] = {
			description: 'The input date is a business day
			schema: { type: boolean }
		}
		#swagger.responses[400] = {}
		#swagger.responses[404] = {}
	 */
	composeMiddleware(
		validateDateParameter({
			parameterName: 'inputDate',
			isRequired: true,
			mustBeBusinessDay: true
		}),
		validationErrorHandler
	),
	asyncHandler(validate)
);

export { router as businessDaysRoutes };
