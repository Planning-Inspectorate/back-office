import { Router as createRouter } from 'express';
import * as controller from './applications-create-applicant.controller.js';
import * as guards from './applications-create-applicant.guards.js';
import * as locals from './applications-create-applicant.locals.js';

const applicationsCreateApplicantRouter = createRouter();

applicationsCreateApplicantRouter.use(locals.registerBackLink);

applicationsCreateApplicantRouter
	.route('/applicant-information-types')
	.get(controller.viewApplicationsCreateApplicantTypes)
	.post(controller.updateApplicationsCreateApplicantTypes);

applicationsCreateApplicantRouter
	.route('/applicant-organisation-name')
	.get(guards.assertStepIsBeingProvided, controller.viewApplicationsCreateApplicantOrganisationName)
	.post(controller.updateApplicationsCreateApplicantOrganisationName);

applicationsCreateApplicantRouter
	.route('/applicant-full-name')
	.get(guards.assertStepIsBeingProvided, controller.viewApplicationsCreateApplicantFullName)
	.post(controller.updateApplicationsCreateApplicantFullName);

applicationsCreateApplicantRouter
	.route('/applicant-address')
	.get(guards.assertStepIsBeingProvided, controller.viewApplicationsCreateApplicantAddress)
	.post(controller.updateApplicationsCreateApplicantAddress);

applicationsCreateApplicantRouter
	.route('/applicant-website')
	.get(guards.assertStepIsBeingProvided, controller.viewApplicationsCreateApplicantWebsite)
	.post(controller.updateApplicationsCreateApplicantWebsite);

applicationsCreateApplicantRouter
	.route('/applicant-email')
	.get(guards.assertStepIsBeingProvided, controller.viewApplicationsCreateApplicantEmail)
	.post(controller.updateApplicationsCreateApplicantEmail);

applicationsCreateApplicantRouter
	.route('/applicant-telephone-number')
	.get(guards.assertStepIsBeingProvided, controller.viewApplicationsCreateApplicantTelephoneNumber)
	.post(controller.updateApplicationsCreateApplicantTelephoneNumber);

export default applicationsCreateApplicantRouter;
