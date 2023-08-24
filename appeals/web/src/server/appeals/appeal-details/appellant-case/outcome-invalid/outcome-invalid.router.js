import { Router as createRouter } from 'express';
import * as controller from './outcome-invalid.controller.js';
import * as validators from './outcome-invalid.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getInvalidReason)
	.post(
		(req, res, next) => {
			console.log('req.body:');
			console.log(JSON.stringify(req.body));
			next();
		},
		validators.validateInvalidReason,
		controller.postInvalidReason
	);

export default router;
