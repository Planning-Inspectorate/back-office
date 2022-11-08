import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import { registerApplicantId } from '../../../create-new-case/applicant/applications-create-applicant.locals.js';
import * as validators from '../../../create-new-case/applicant/applications-create-applicant.validators.js';
import * as controller from './applications-edit-applicant.controller.js';

const applicationsEditApplicantRouter = createRouter();

applicationsEditApplicantRouter.use(registerApplicantId);

applicationsEditApplicantRouter
	.route('/applicant-organisation-name')
	.get(asyncRoute(controller.viewApplicationsEditApplicantOrganisationName))
	.post(asyncRoute(controller.updateApplicationsEditApplicantOrganisationName));

applicationsEditApplicantRouter
	.route('/applicant-full-name')
	.get(asyncRoute(controller.viewApplicationsEditApplicantFullName))
	.post(asyncRoute(controller.updateApplicationsEditApplicantFullName));

applicationsEditApplicantRouter
	.route('/applicant-address')
	.get(asyncRoute(controller.viewApplicationsEditApplicantAddressReadyOnly))
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncRoute(controller.updateApplicationsEditApplicantAddress)
	);

applicationsEditApplicantRouter
	.route('/applicant-address/new')
	.get(asyncRoute(controller.viewApplicationsEditApplicantAddress))
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncRoute(controller.updateApplicationsEditApplicantAddress)
	);

applicationsEditApplicantRouter
	.route('/applicant-website')
	.get(asyncRoute(controller.viewApplicationsEditApplicantWebsite))
	.post(
		validators.validateApplicationsCreateApplicantWebsite,
		asyncRoute(controller.updateApplicationsEditApplicantWebsite)
	);

applicationsEditApplicantRouter
	.route('/applicant-email')
	.get(asyncRoute(controller.viewApplicationsEditApplicantEmail))
	.post(
		validators.validateApplicationsCreateApplicantEmail,
		asyncRoute(controller.updateApplicationsEditApplicantEmail)
	);

applicationsEditApplicantRouter
	.route('/applicant-telephone-number')
	.get(asyncRoute(controller.viewApplicationsEditApplicantTelephoneNumber))
	.post(
		validators.validateApplicationsCreateApplicantTelephoneNumber,
		asyncRoute(controller.updateApplicationsEditApplicantTelephoneNumber)
	);

export default applicationsEditApplicantRouter;
