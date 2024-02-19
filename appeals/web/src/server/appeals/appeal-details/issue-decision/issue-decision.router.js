import { Router as createRouter } from 'express';

import * as controller from './issue-decision.controller.js';
import * as validators from './issue-decision.validators.js';

const router = createRouter({ mergeParams: true });

router
	.route('/decision')
	.get(controller.getIssueDecision)
	.post(validators.validateDecision, controller.postIssueDecision);

router
	.route('/decision-letter-upload')
	.get(controller.getDecisionLetterUpload)
	.post(controller.postDecisionLetterUpload);

router
	.route('/decision-letter-date')
	.get(controller.getDateDecisionLetter)
	.post(
		validators.validateVisitDateFields,
		validators.validateVisitDateValid,
		validators.validateDueDateInPastOrToday,
		controller.postDateDecisionLetter
	);

router
	.route('/invalid-reason')
	.get(controller.getInvalidReason)
	.post(validators.validateTextArea, controller.postInvalidReason);

router
	.route('/check-your-decision')
	.get(controller.getCheckDecision)
	.post(validators.validateCheckDecision, controller.postCheckDecision);

router
	.route('/check-invalid-decision')
	.get(controller.getCheckInvalidDecision)
	.post(validators.validateCheckDecision, controller.postCheckInvalidDecision);

router.route('/decision-sent').get(controller.getDecisionSent);

export default router;
