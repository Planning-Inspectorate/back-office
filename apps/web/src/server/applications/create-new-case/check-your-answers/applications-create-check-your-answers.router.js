import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { registerCaseWithQuery } from '../../applications.locals.js';
import * as controller from './applications-create-check-your-answers.controller.js';

const applicationsCreateCheckYourAnswersRouter = createRouter();

applicationsCreateCheckYourAnswersRouter
	.route('/check-your-answers')
	.get(
		registerCaseWithQuery(null, true),
		asyncHandler(controller.viewApplicationsCreateCheckYourAnswers)
	)
	.post(asyncHandler(controller.confirmCreateCase));

applicationsCreateCheckYourAnswersRouter
	.route('/case-created')
	.get(
		registerCaseWithQuery(['reference']),
		asyncHandler(controller.viewApplicationsCreateConfirmation)
	);

export default applicationsCreateCheckYourAnswersRouter;
