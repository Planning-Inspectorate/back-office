import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as controller from './applications-create-check-your-answers.controller.js';

const applicationsCreateCheckYourAnswersRouter = createRouter();

applicationsCreateCheckYourAnswersRouter
	.route('/case-created')
	.get(asyncRoute(controller.viewApplicationsCreateConfirmation));

applicationsCreateCheckYourAnswersRouter
	.route('/check-your-answers')
	.get(asyncRoute(controller.viewApplicationsCreateCheckYourAnswers))
	.post(asyncRoute(controller.confirmCreateCase));

export default applicationsCreateCheckYourAnswersRouter;
