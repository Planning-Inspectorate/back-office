import { Router as createRouter } from 'express';
import * as controller from './applications-create-check-your-answers.controller.js';

const applicationsCreateCheckYourAnswersRouter = createRouter();

applicationsCreateCheckYourAnswersRouter
	.route('/case-created')
	.get(controller.viewApplicationsCreateConfirmation);

applicationsCreateCheckYourAnswersRouter
	.route('/check-your-answers')
	.get(controller.viewApplicationsCreateCheckYourAnswers)
	.post(controller.updateApplicationsCreateCase);

export default applicationsCreateCheckYourAnswersRouter;
