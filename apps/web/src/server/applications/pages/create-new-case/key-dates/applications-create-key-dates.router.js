import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as controller from './applications-create-key-dates.controller.js';
import * as validators from './applications-create-key-dates.validators.js';

const applicationsCreateKeyDatesRouter = createRouter();

applicationsCreateKeyDatesRouter
	.route('/key-dates')
	.get(asyncRoute(controller.viewApplicationsCreateKeyDates))
	.post(
		validators.validateApplicationsCreateKeyDates,
		asyncRoute(controller.updateApplicationsCreateKeyDates)
	);

export default applicationsCreateKeyDatesRouter;
