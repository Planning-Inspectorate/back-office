import { Router as createRouter } from 'express';
import * as controller from './outcome-invalid.controller.js';
import * as validators from './outcome-invalid.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getInvalidReason)
	.post(
		(req, res, next) => {
			//const sdkgflgj = 0;
			next();
		},
		validators.validateInvalidReason,
		validators.validateTextArea,
		controller.postInvalidReason
	);

export default router;
