import { Router as createRouter } from 'express';

import * as controller from './change-appeal-type.controller.js';
import * as validators from './change-appeal-type.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/appeal-type')
	.get(controller.getAppealType)
	.post(validators.validateAppealType, controller.postAppealType);

router
	.route('/resubmit')
	.get(controller.getResubmitAppeal)
	.post(validators.validateResubmitAppeal, controller.postResubmitAppeal);

router
	.route('/change-appeal-final-date')
	.get(controller.getChangeAppealFinalDate)
	.post(
		validators.validateChangeAppealFinalDateFields,
		validators.validateChangeAppealFinalDateValid,
		validators.validateChangeAppealFinalDateIsBusinessDay,
		validators.validateChangeAppealFinalDateInFuture,
		controller.postChangeAppealFinalDate
	);

router
	.route('/add-horizon-reference')
	.get(controller.getAddHorizonReference)
	.post(validators.validateHorizonReference, controller.postAddHorizonReference);

router
	.route('/check-transfer')
	.get(controller.getCheckTransfer)
	.post(validators.validateCheckTransfer, controller.postCheckTransfer);

router.route('/confirm-resubmit').get(controller.getConfirmResubmit);

export default router;
