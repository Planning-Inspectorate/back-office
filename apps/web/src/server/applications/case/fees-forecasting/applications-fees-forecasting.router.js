import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-fees-forecasting.controller.js';
import { feesForecastingValidator } from './applications-fees-forecasting.validators.js';

const applicationsFeesForecastingRouter = createRouter({ mergeParams: true });

/** @param {*} req
 * @param {*} res
 * @param {*} next
 * */
const setFeeEditFlag = (req, res, next) => {
	req.isFeeEdit = true;
	next();
};

/** @param {*} req
 * @param {*} res
 * @param {*} next
 * */
const setFeeDeletionFlag = (req, res, next) => {
	req.isFeeDeletion = true;
	next();
};

/** @param {*} req
 * @param {*} res
 * @param {*} next
 * */
const setProjectMeetingEditFlag = (req, res, next) => {
	req.isProjectMeetingEdit = true;
	next();
};

/** @param {*} req
 * @param {*} res
 * @param {*} next
 * */
const setProjectMeetingDeletionFlag = (req, res, next) => {
	req.isProjectMeetingDeletion = true;
	next();
};

applicationsFeesForecastingRouter.route('/').get(asyncHandler(controller.getFeesForecastingIndex));

applicationsFeesForecastingRouter
	.route('/section/manage-fee/id/:feeId')
	.get(setFeeEditFlag, asyncHandler(controller.getFeesForecastingEditSection))
	.post(
		setFeeEditFlag,
		feesForecastingValidator,
		asyncHandler(controller.updateFeesForecastingEditSection)
	);

applicationsFeesForecastingRouter
	.route('/section/manage-fee/id/:feeId/delete')
	.get(setFeeDeletionFlag, asyncHandler(controller.getFeesForecastingDeleteSection))
	.post(setFeeDeletionFlag, asyncHandler(controller.deleteFeesForecastingField));

applicationsFeesForecastingRouter
	.route('/section/manage-project-meeting/id/:meetingId')
	.get(setProjectMeetingEditFlag, asyncHandler(controller.getFeesForecastingEditSection))
	.post(
		setProjectMeetingEditFlag,
		feesForecastingValidator,
		asyncHandler(controller.updateFeesForecastingEditSection)
	);

applicationsFeesForecastingRouter
	.route('/section/manage-project-meeting/id/:meetingId/delete')
	.get(setProjectMeetingDeletionFlag, asyncHandler(controller.getFeesForecastingDeleteSection))
	.post(setProjectMeetingDeletionFlag, asyncHandler(controller.deleteFeesForecastingField));

applicationsFeesForecastingRouter
	.route('/section/:sectionName')
	.get(asyncHandler(controller.getFeesForecastingEditSection))
	.post(feesForecastingValidator, asyncHandler(controller.updateFeesForecastingEditSection));

export default applicationsFeesForecastingRouter;
