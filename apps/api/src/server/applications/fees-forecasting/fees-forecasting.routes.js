import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { validateApplicationId } from '../application/application.validators.js';
import { updateFeesForecasting } from './fees-forecasting.controller.js';

const router = createRouter();

router.patch(
	'/:id/fees-forecasting/:sectionName',
	validateApplicationId,
	asyncHandler(updateFeesForecasting)
);

export { router as feesForecastingRoutes };
