import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { validateApplicationId } from '../application/application.validators.js';
import { updateFeesForecasting } from './fees-forecasting.controller.js';

const router = createRouter();

router.patch(
	'/:id/fees-forecasting/:sectionName',
	/*
				#swagger.tags = ['Applications']
				#swagger.path = '/applications/{caseId}/fees-forecasting/{sectionName}'
				#swagger.description = 'Updates fees and forecasting data for a case.'
				#swagger.parameters['caseId] = {
					in: 'path',
					description: 'Case ID',
					required: true,
					type: 'integer'
				}
				#swagger.parameters['sectionName'] = {
					in: 'path',
					description: 'Fees and forecasting section name',
					required: true,
					type: 'string'
				}
				#swagger.parameters['body'] = {
					in: 'body',
					description: 'Fees and forecasting update parameters',
					required: true,
					schema: { $ref: '#/definitions/FeesForecasting' }
				}
				#swagger.parameters['x-service-name'] = {
					in: 'header',
					type: 'string',
					default: 'swagger'
				}
				#swagger.parameters['x-api-key'] = {
					in: 'header',
					type: 'string',
					default: '123'
				}
				#swagger.responses[200] = {
					description: 'Updated fees and forecasting data',
					schema: { $ref: '#/definitions/FeesForecasting' }
				}
        #swagger.responses[404] = {
            description: 'Not found',
            schema: { $ref: '#/definitions/NotFound' }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: '#/definitions/InternalError' }
        }
	 */
	validateApplicationId,
	asyncHandler(updateFeesForecasting)
);

export { router as feesForecastingRoutes };
