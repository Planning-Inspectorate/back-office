import { Router as createRouter } from 'express';
import asyncRoute from '#lib/async-route.js';
import * as controller from './change-appeal-type.controller.js';
import * as validators from './change-appeal-type.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/appeal-type')
	.get(asyncRoute(controller.getAppealType))
	.post(validators.validateAppealType, asyncRoute(controller.postAppealType));

router
	.route('/resubmit')
	.get(asyncRoute(controller.getResubmitAppeal))
	.post(validators.validateResubmitAppeal, asyncRoute(controller.postResubmitAppeal));

router
	.route('/change-appeal-final-date')
	.get(asyncRoute(controller.getChangeAppealFinalDate))
	.post(
		validators.validateChangeAppealFinalDateFields,
		validators.validateChangeAppealFinalDateValid,
		validators.validateChangeAppealFinalDateIsBusinessDay,
		validators.validateChangeAppealFinalDateInFuture,
		asyncRoute(controller.postChangeAppealFinalDate)
	);

router
	.route('/add-horizon-reference')
	.get(asyncRoute(controller.getAddHorizonReference))
	.post(validators.validateHorizonReference, asyncRoute(controller.postAddHorizonReference));

router
	.route('/check-transfer')
	.get(asyncRoute(controller.getCheckTransfer))
	.post(validators.validateCheckTransfer, asyncRoute(controller.postCheckTransfer));

router.route('/confirm-resubmit').get(asyncRoute(controller.getConfirmResubmit));

export default router;
