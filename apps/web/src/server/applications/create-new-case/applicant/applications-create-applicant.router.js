import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
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
	.post(asyncHandler(controller.updateApplicationsCreateApplicantTypes));

applicationsCreateApplicantRouter
	.route('/applicant-organisation-name')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicant'], true),
		asyncHandler(controller.viewApplicationsCreateApplicantOrganisationName)
	)
	.post(asyncHandler(controller.updateApplicationsCreateApplicantOrganisationName));

applicationsCreateApplicantRouter
	.route('/applicant-full-name')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicant'], true),
		asyncHandler(controller.viewApplicationsCreateApplicantFullName)
	)
	.post(asyncHandler(controller.updateApplicationsCreateApplicantFullName));

applicationsCreateApplicantRouter
	.route('/applicant-address')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicant'], true),
		asyncHandler(controller.viewApplicationsCreateApplicantAddress)
	)
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncHandler(controller.updateApplicationsCreateApplicantAddress)
	);

applicationsCreateApplicantRouter
	.route('/applicant-website')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicant'], true),
		asyncHandler(controller.viewApplicationsCreateApplicantWebsite)
	)
	.post(
		validators.validateApplicationsCreateApplicantWebsite,
		asyncHandler(controller.updateApplicationsCreateApplicantWebsite)
	);

applicationsCreateApplicantRouter
	.route('/applicant-email')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicant'], true),
		asyncHandler(controller.viewApplicationsCreateApplicantEmail)
	)
	.post(
		validators.validateApplicationsCreateApplicantEmail,
		asyncHandler(controller.updateApplicationsCreateApplicantEmail)
	);

applicationsCreateApplicantRouter
	.route('/applicant-telephone-number')
	.get(
		guards.assertStepIsAllowed,
		registerCaseWithQuery(['applicant'], true),
		asyncHandler(controller.viewApplicationsCreateApplicantTelephoneNumber)
	)
	.post(
		validators.validateApplicationsCreateApplicantTelephoneNumber,
		asyncHandler(controller.updateApplicationsCreateApplicantTelephoneNumber)
	);

export default applicationsCreateApplicantRouter;
