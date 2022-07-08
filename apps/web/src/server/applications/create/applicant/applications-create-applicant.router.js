import { Router as createRouter } from 'express';
import * as controller from './applications-create-applicant.controller.js';

const applicationsCreateApplicantRouter = createRouter();

applicationsCreateApplicantRouter
	.route('/applicant-information-types')
	.get(controller.viewApplicationsCreateApplicantTypes);

export default applicationsCreateApplicantRouter;
