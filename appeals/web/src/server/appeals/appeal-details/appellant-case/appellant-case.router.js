import { Router as createRouter } from 'express';
import * as controller from './appellant-case.controller.js';
import * as validators from './appellant-case.validators.js';
import outcomeInvalidRouter from './outcome-invalid/outcome-invalid.router.js';
import outcomeIncompleteRouter from './outcome-incomplete/outcome-incomplete.router.js';

const router = createRouter({ mergeParams: true });

router
	.route('/')
	.get(controller.getAppellantCase)
	.post(validators.validateReviewOutcome, controller.postAppellantCase);

router.use('/invalid', outcomeInvalidRouter);
router.use('/incomplete', outcomeIncompleteRouter);

router
	.route('/check-your-answers')
	.get(controller.getCheckAndConfirm)
	.post(controller.postCheckAndConfirm);

export default router;
