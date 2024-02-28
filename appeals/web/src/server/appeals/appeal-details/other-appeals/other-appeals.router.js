import { Router as createRouter } from 'express';
import { validateAppeal } from '../appeal-details.middleware.js';
import * as validators from './other-appeals.validators.js';
import * as controller from './other-appeals.controller.js';

const router = createRouter({ mergeParams: true });

router
	.route('/add')
	.get(validateAppeal, controller.getAddOtherAppeals)
	.post(
		validateAppeal,
		validators.validateAddOtherAppealsReference,
		controller.postAddOtherAppeals
	);

router
	.route('/confirm')
	.get(validateAppeal, controller.getConfirmOtherAppeals)
	.post(validateAppeal, validators.validateRelateAppealAnswer, controller.postConfirmOtherAppeals);

export default router;
