import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { registerCaseWithQuery } from '../../applications.locals.js';
import * as controller from './applications-create-check-your-answers.controller.js';

const applicationsCreateCheckYourAnswersRouter = createRouter();

applicationsCreateCheckYourAnswersRouter
	.route('/check-your-answers')
	.get(
		registerCaseWithQuery(null, true),
		asyncRoute(controller.viewApplicationsCreateCheckYourAnswers)
	)
	.post(asyncRoute(controller.confirmCreateCase));

applicationsCreateCheckYourAnswersRouter
	.route('/case-created')
	.get(
		registerCaseWithQuery(['reference']),
		asyncRoute(controller.viewApplicationsCreateConfirmation)
	);

export default applicationsCreateCheckYourAnswersRouter;
