import { Router as createRouter } from 'express';
import { registerApplicantId } from '../../../create/applicant/applications-create-applicant.locals.js';
import * as validators from '../../../create/applicant/applications-create-applicant.validators.js';
import * as controller from './applications-edit-applicant.controller.js';

const applicationsEditApplicantRouter = createRouter();

// applicationsEditApplicantRouter.use(locals.registerApplicantId);
applicationsEditApplicantRouter.use(registerApplicantId);

applicationsEditApplicantRouter
	.route('/applicant-organisation-name')
	.get(controller.viewApplicationsEditApplicantOrganisationName)
	.post(controller.updateApplicationsEditApplicantOrganisationName);

applicationsEditApplicantRouter
	.route('/applicant-full-name')
	.get(controller.viewApplicationsEditApplicantFullName)
	.post(controller.updateApplicationsEditApplicantFullName);

applicationsEditApplicantRouter
	.route('/applicant-address')
	.get(controller.viewApplicationsEditApplicantAddress)
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		controller.updateApplicationsEditApplicantAddress
	);

applicationsEditApplicantRouter
	.route('/applicant-website')
	.get(controller.viewApplicationsEditApplicantWebsite)
	.post(
		validators.validateApplicationsCreateApplicantWebsite,
		controller.updateApplicationsEditApplicantWebsite
	);

applicationsEditApplicantRouter
	.route('/applicant-email')
	.get(controller.viewApplicationsEditApplicantEmail)
	.post(
		validators.validateApplicationsCreateApplicantEmail,
		controller.updateApplicationsEditApplicantEmail
	);

applicationsEditApplicantRouter
	.route('/applicant-telephone-number')
	.get(controller.viewApplicationsEditApplicantTelephoneNumber)
	.post(
		validators.validateApplicationsCreateApplicantTelephoneNumber,
		controller.updateApplicationsEditApplicantTelephoneNumber
	);

export default applicationsEditApplicantRouter;
