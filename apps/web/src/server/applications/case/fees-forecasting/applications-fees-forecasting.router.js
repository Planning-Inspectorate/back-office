import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-fees-forecasting.controller.js';
import { feesForecastingValidator } from './applications-fees-forecasting.validators.js';

const applicationsFeesForecastingRouter = createRouter({ mergeParams: true });

applicationsFeesForecastingRouter.route('/').get(asyncHandler(controller.getFeesForecastingIndex));

applicationsFeesForecastingRouter
	.route('/section/manage-fee/id/:feeId')
	.get(
		/** @param {*} req @param {*} res @param {*} next */
		(req, res, next) => {
			req.isFeeEdit = true;
			next();
		},
		asyncHandler(controller.getFeesForecastingEditSection)
	)
	.post(
		/** @param {*} req @param {*} res @param {*} next */
		(req, res, next) => {
			req.isFeeEdit = true;
			next();
		},
		feesForecastingValidator,
		asyncHandler(controller.updateFeesForecastingEditSection)
	);

applicationsFeesForecastingRouter
	.route('/section/manage-fee/id/:feeId/delete')
	.get(
		/** @param {*} req @param {*} res @param {*} next */
		(req, res, next) => {
			req.isFeeDeletion = true;
			next();
		},
		asyncHandler(controller.getFeesForecastingDeleteSection)
	)
	.post(
		/** @param {*} req @param {*} res @param {*} next */
		(req, res, next) => {
			req.isFeeDeletion = true;
			next();
		},
		asyncHandler(controller.deleteFeesForecastingField)
	);

applicationsFeesForecastingRouter
	.route('/section/:sectionName')
	.get(asyncHandler(controller.getFeesForecastingEditSection))
	.post(feesForecastingValidator, asyncHandler(controller.updateFeesForecastingEditSection));

export default applicationsFeesForecastingRouter;
