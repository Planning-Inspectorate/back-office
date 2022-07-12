import { Router as createRouter } from 'express';
import * as controller from './applications-create-applicant.controller.js';
import * as guards from './applications-create-applicant.guards.js';
import * as validators from './applications-create-applicant.validators.js';

const applicationsCreateApplicantRouter = createRouter();

applicationsCreateApplicantRouter.use(guards.assertStepIsBeingProvided);

applicationsCreateApplicantRouter
	.route('/applicant-information-types')
	.get(controller.viewApplicationsCreateApplicantTypes)
	.post(
		validators.validateApplicationsCreateApplicantTypes,
		controller.updateApplicationsCreateApplicantTypes
	);

applicationsCreateApplicantRouter
	.route('/applicant-organisation-name')
	.get(controller.viewApplicationsCreateApplicantOrganisationName)
	.post(controller.updateApplicationsCreateApplicantOrganisationName);

applicationsCreateApplicantRouter
	.route('/applicant-full-name')
	.get(controller.viewApplicationsCreateApplicantFullName)
	.post(controller.updateApplicationsCreateApplicantFullName);

applicationsCreateApplicantRouter
	.route('/applicant-address')
	.get(controller.viewApplicationsCreateApplicantAddress)
	.post(controller.updateApplicationsCreateApplicantAddress);

applicationsCreateApplicantRouter
	.route('/applicant-website')
	.get(controller.viewApplicationsCreateApplicantWebsite)
	.post(controller.updateApplicationsCreateApplicantWebsite);

applicationsCreateApplicantRouter
	.route('/applicant-email')
	.get(controller.viewApplicationsCreateApplicantEmail)
	.post(controller.updateApplicationsCreateApplicantEmail);

applicationsCreateApplicantRouter
	.route('/applicant-telephone-number')
	.get(controller.viewApplicationsCreateApplicantTelephoneNumber)
	.post(controller.updateApplicationsCreateApplicantTelephoneNumber);

export default applicationsCreateApplicantRouter;
