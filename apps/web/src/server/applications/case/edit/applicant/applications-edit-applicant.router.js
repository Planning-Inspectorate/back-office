import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
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
		asyncHandler(controller.viewApplicationsEditApplicantOrganisationName)
	)
	.post(
		validators.validateApplicationsCreateApplicantOrganisationName,
		asyncHandler(controller.updateApplicationsEditApplicantOrganisationName)
	);

applicationsEditApplicantRouter
	.route('/applicant-full-name')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncHandler(controller.viewApplicationsEditApplicantFullName)
	)
	.post(asyncHandler(controller.updateApplicationsEditApplicantFullName));

applicationsEditApplicantRouter
	.route('/applicant-address')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncHandler(controller.viewApplicationsEditApplicantAddressReadyOnly)
	)
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncHandler(controller.updateApplicationsEditApplicantAddress)
	);

applicationsEditApplicantRouter
	.route('/applicant-address/new')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncHandler(controller.viewApplicationsEditApplicantAddress)
	)
	.post(
		validators.validateApplicationsCreateApplicantPostCode,
		asyncHandler(controller.updateApplicationsEditApplicantAddress)
	);

applicationsEditApplicantRouter
	.route('/applicant-website')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncHandler(controller.viewApplicationsEditApplicantWebsite)
	)
	.post(
		validators.validateApplicationsCreateApplicantWebsite,
		asyncHandler(controller.updateApplicationsEditApplicantWebsite)
	);

applicationsEditApplicantRouter
	.route('/applicant-email')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncHandler(controller.viewApplicationsEditApplicantEmail)
	)
	.post(
		validators.validateApplicationsCreateApplicantEmail,
		asyncHandler(controller.updateApplicationsEditApplicantEmail)
	);

applicationsEditApplicantRouter
	.route('/applicant-telephone-number')
	.get(
		registerCaseWithQuery(['applicant']),
		asyncHandler(controller.viewApplicationsEditApplicantTelephoneNumber)
	)
	.post(
		validators.validateApplicationsCreateApplicantTelephoneNumber,
		asyncHandler(controller.updateApplicationsEditApplicantTelephoneNumber)
	);

export default applicationsEditApplicantRouter;
