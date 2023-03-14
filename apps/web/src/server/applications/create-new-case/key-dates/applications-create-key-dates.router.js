import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { registerCaseWithQuery } from '../../applications.locals.js';
import * as locals from '../applicant/applications-create-applicant.locals.js';
import * as controller from './applications-create-key-dates.controller.js';
import * as validators from './applications-create-key-dates.validators.js';

const applicationsCreateKeyDatesRouter = createRouter();

applicationsCreateKeyDatesRouter.use(locals.registerBackPath);

applicationsCreateKeyDatesRouter
	.route('/key-dates')
	.get(
		registerCaseWithQuery(['keyDates'], true),
		asyncRoute(controller.viewApplicationsCreateKeyDates)
	)
	.post(
		validators.validateApplicationsCreateKeyDates,
		asyncRoute(controller.updateApplicationsCreateKeyDates)
	);

export default applicationsCreateKeyDatesRouter;
