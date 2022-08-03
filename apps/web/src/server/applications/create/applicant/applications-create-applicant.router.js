import { Router as createRouter } from 'express';
import * as controller from './applications-create-applicant.controller.js';
import * as guards from './applications-create-applicant.guards.js';
import * as locals from './applications-create-applicant.locals.js';
import * as validators from './applications-create-applicant.validators.js';

const applicationsCreateApplicantRouter = createRouter();

applicationsCreateApplicantRouter.use(locals.registerBackPath);

applicationsCreateApplicantRouter
	.route('/applicant-information-types')
	.get(controller.viewApplicationsCreateApplicantTypes)
	.post(controller.updateApplicationsCreateApplicantTypes);

applicationsCreateApplicantRouter
	.route('/applicant-organisation-name')
	.get(guards.assertStepIsAllowed, controller.viewApplicationsCreateApplicantOrganisationName)
	.post(controller.updateApplicationsCreateApplicantOrganisationName);

applicationsCreateApplicantRouter
	.route('/applicant-full-name')
	.get(guards.assertStepIsAllowed, controller.viewApplicationsCreateApplicantFullName)
	.post(controller.updateApplicationsCreateApplicantFullName);

applicationsCreateApplicantRouter
	.route('/applicant-address')
	.get(guards.assertStepIsAllowed, controller.viewApplicationsCreateApplicantAddress)
	.post(controller.updateApplicationsCreateApplicantAddress);

applicationsCreateApplicantRouter
	.route('/applicant-website')
	.get(guards.assertStepIsAllowed, controller.viewApplicationsCreateApplicantWebsite)
	.post(
		validators.validateApplicationsCreateApplicantWebsite,
		controller.updateApplicationsCreateApplicantWebsite
	);

applicationsCreateApplicantRouter
	.route('/applicant-email')
	.get(guards.assertStepIsAllowed, controller.viewApplicationsCreateApplicantEmail)
	.post(
		validators.validateApplicationsCreateApplicantEmail,
		controller.updateApplicationsCreateApplicantEmail
	);

applicationsCreateApplicantRouter
	.route('/applicant-telephone-number')
	.get(guards.assertStepIsAllowed, controller.viewApplicationsCreateApplicantTelephoneNumber)
	.post(
		validators.validateApplicationsCreateApplicantTelephoneNumber,
		controller.updateApplicationsCreateApplicantTelephoneNumber
	);

export default applicationsCreateApplicantRouter;
