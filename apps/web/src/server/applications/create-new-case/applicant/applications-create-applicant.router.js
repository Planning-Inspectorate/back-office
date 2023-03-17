import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { registerCaseWithQuery } from '../../applications.locals.js';
import * as controller from './applications-create-applicant.controller.js';
import * as guards from './applications-create-applicant.guards.js';
import * as locals from './applications-create-applicant.locals.js';
import * as validators from './applications-create-applicant.validators.js';

const applicationsCreateApplicantRouter = createRouter();

applicationsCreateApplicantRouter.use(locals.registerApplicantId);

applicationsCreateApplicantRouter
	.route('/applicant-information-types')
	.get(controller.viewApplicationsCreateApplicantTypes)
	.post(asyncRoute(controller.updateApplicationsCreateApplicantTypes));

applicationsCreateApplicantRouter
	.route('/applicant-organisation-name')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicants'], true),
		asyncRoute(controller.viewApplicationsCreateApplicantOrganisationName)
	)
	.post(asyncRoute(controller.updateApplicationsCreateApplicantOrganisationName));

applicationsCreateApplicantRouter
	.route('/applicant-full-name')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicants'], true),
		asyncRoute(controller.viewApplicationsCreateApplicantFullName)
	)
	.post(asyncRoute(controller.updateApplicationsCreateApplicantFullName));

applicationsCreateApplicantRouter
	.route('/applicant-address')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicants', 'applicantsAddress'], true),
		asyncRoute(controller.viewApplicationsCreateApplicantAddress)
	)
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncRoute(controller.updateApplicationsCreateApplicantAddress)
	);

applicationsCreateApplicantRouter
	.route('/applicant-website')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicants'], true),
		asyncRoute(controller.viewApplicationsCreateApplicantWebsite)
	)
	.post(
		validators.validateApplicationsCreateApplicantWebsite,
		asyncRoute(controller.updateApplicationsCreateApplicantWebsite)
	);

applicationsCreateApplicantRouter
	.route('/applicant-email')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicants'], true),
		asyncRoute(controller.viewApplicationsCreateApplicantEmail)
	)
	.post(
		validators.validateApplicationsCreateApplicantEmail,
		asyncRoute(controller.updateApplicationsCreateApplicantEmail)
	);

applicationsCreateApplicantRouter
	.route('/applicant-telephone-number')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicants'], true),
		asyncRoute(controller.viewApplicationsCreateApplicantTelephoneNumber)
	)
	.post(
		validators.validateApplicationsCreateApplicantTelephoneNumber,
		asyncRoute(controller.updateApplicationsCreateApplicantTelephoneNumber)
	);

export default applicationsCreateApplicantRouter;
