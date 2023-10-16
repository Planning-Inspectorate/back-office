import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { registerCaseWithQuery } from '../../../applications.locals.js';
import { registerApplicantId } from '../../../create-new-case/applicant/applications-create-applicant.locals.js';
import * as validators from '../../../create-new-case/applicant/applications-create-applicant.validators.js';
import * as controller from './applications-edit-applicant.controller.js';

const applicationsEditApplicantRouter = createRouter();

applicationsEditApplicantRouter.use(registerApplicantId);

applicationsEditApplicantRouter
	.route('/applicant-organisation-name')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncRoute(controller.viewApplicationsEditApplicantOrganisationName)
	)
	.post(asyncRoute(controller.updateApplicationsEditApplicantOrganisationName));

applicationsEditApplicantRouter
	.route('/applicant-full-name')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncRoute(controller.viewApplicationsEditApplicantFullName)
	)
	.post(asyncRoute(controller.updateApplicationsEditApplicantFullName));

applicationsEditApplicantRouter
	.route('/applicant-address')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncRoute(controller.viewApplicationsEditApplicantAddressReadyOnly)
	)
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncRoute(controller.updateApplicationsEditApplicantAddress)
	);

applicationsEditApplicantRouter
	.route('/applicant-address/new')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncRoute(controller.viewApplicationsEditApplicantAddress)
	)
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncRoute(controller.updateApplicationsEditApplicantAddress)
	);

applicationsEditApplicantRouter
	.route('/applicant-website')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncRoute(controller.viewApplicationsEditApplicantWebsite)
	)
	.post(
		validators.validateApplicationsCreateApplicantWebsite,
		asyncRoute(controller.updateApplicationsEditApplicantWebsite)
	);

applicationsEditApplicantRouter
	.route('/applicant-email')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncRoute(controller.viewApplicationsEditApplicantEmail)
	)
	.post(
		validators.validateApplicationsCreateApplicantEmail,
		asyncRoute(controller.updateApplicationsEditApplicantEmail)
	);

applicationsEditApplicantRouter
	.route('/applicant-telephone-number')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncRoute(controller.viewApplicationsEditApplicantTelephoneNumber)
	)
	.post(
		validators.validateApplicationsCreateApplicantTelephoneNumber,
		asyncRoute(controller.updateApplicationsEditApplicantTelephoneNumber)
	);

export default applicationsEditApplicantRouter;
