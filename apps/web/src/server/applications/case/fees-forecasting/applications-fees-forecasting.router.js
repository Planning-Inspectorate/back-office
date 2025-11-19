import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from '../fees-forecasting/applications-fees-forecasting.controller.js';

const applicationsFeesForecastingRouter = createRouter({ mergeParams: true });

applicationsFeesForecastingRouter.route('/').get(asyncHandler(controller.getFeesForecastingIndex));

export default applicationsFeesForecastingRouter;
