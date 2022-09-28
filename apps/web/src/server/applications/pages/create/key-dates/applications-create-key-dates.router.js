import { Router as createRouter } from 'express';
import * as controller from './applications-create-key-dates.controller.js';
import * as validators from './applications-create-key-dates.validators.js';

const applicationsCreateKeyDatesRouter = createRouter();

applicationsCreateKeyDatesRouter
	.route('/key-dates')
	.get(controller.viewApplicationsCreateKeyDates)
	.post(validators.validateApplicationsCreateKeyDates, controller.updateApplicationsCreateKeyDates);

export default applicationsCreateKeyDatesRouter;
