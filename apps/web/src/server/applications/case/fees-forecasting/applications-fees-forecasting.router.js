import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-fees-forecasting.controller.js';
import { feesForecastingValidator } from './applications-fees-forecasting.validators.js';

const applicationsFeesForecastingRouter = createRouter({ mergeParams: true });

applicationsFeesForecastingRouter.route('/').get(asyncHandler(controller.getFeesForecastingIndex));

applicationsFeesForecastingRouter
	.route('/:sectionName')
	.get(asyncHandler(controller.getFeesForecastingEditSection))
	.post(feesForecastingValidator, asyncHandler(controller.updateFeesForecastingEditSection));

export default applicationsFeesForecastingRouter;
