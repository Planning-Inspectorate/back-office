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
		validators.validateChangeAppealFinalDateInFuture,
		validators.validateChangeAppealFinalDateIsBusinessDay,
		controller.postChangeAppealFinalDate
	);

router.route('/confirm-resubmit').get(controller.getConfirmResubmit);

export default router;
