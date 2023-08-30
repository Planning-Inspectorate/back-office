import { Router as createRouter } from 'express';
import * as controller from './outcome-invalid.controller.js';
import * as validators from './outcome-invalid.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getInvalidReason)
	.post(
		validators.validateInvalidReason,
		validators.validateTextArea,
		controller.postInvalidReason
	);

router.route('/confirmation').get(controller.getConfirmation);

export default router;
