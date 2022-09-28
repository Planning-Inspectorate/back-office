import { Router as createRouter } from 'express';
import * as validators from '../../../create/case/applications-create-case.validators.js';
import * as controller from './applications-edit-case.controller.js';

const applicationsEditCaseRouter = createRouter();

applicationsEditCaseRouter
	.route('/name')
	.get(controller.viewApplicationsEditCaseName)
	.post(
		[validators.validateApplicationsCreateCaseName],
		controller.updateApplicationsEditCaseNameAndDescription
	);

applicationsEditCaseRouter
	.route('/description')
	.get(controller.viewApplicationsEditCaseDescription)
	.post(
		[validators.validateApplicationsCreateCaseDescription],
		controller.updateApplicationsEditCaseNameAndDescription
	);

export default applicationsEditCaseRouter;
