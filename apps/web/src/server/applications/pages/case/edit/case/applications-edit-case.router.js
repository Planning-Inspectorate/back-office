import { Router as createRouter } from 'express';
import * as validators from '../../../create-new-case/case/applications-create-case.validators.js';
import * as controller from './applications-edit-case.controller.js';

const applicationsEditCaseRouter = createRouter();

applicationsEditCaseRouter
	.route('/name')
	.get(controller.viewApplicationsEditCaseName)
	.post(
		[validators.validateApplicationsCreateCaseName],
		controller.updateApplicationsEditCaseNameAndDescription
	);

applicationsEditCaseRouter
	.route('/description')
	.get(controller.viewApplicationsEditCaseDescription)
	.post(
		[validators.validateApplicationsCreateCaseDescription],
		controller.updateApplicationsEditCaseNameAndDescription
	);

applicationsEditCaseRouter
	.route('/team-email')
	.get(controller.viewApplicationsEditCaseTeamEmail)
	.post(validators.validateApplicationsTeamEmail, controller.updateApplicationsEditCaseTeamEmail);

applicationsEditCaseRouter
	.route('/project-location')
	.get(controller.viewApplicationsCreateCaseLocation)
	.post(
		validators.validateApplicationsCreateCaseLocation,
		controller.updateApplicationsEditCaseGeographicalInformation
	);

applicationsEditCaseRouter
	.route('/grid-references')
	.get(controller.viewApplicationsCreateCaseGridReferences)
	.post(
		[
			validators.validateApplicationsCreateCaseEasting,
			validators.validateApplicationsCreateCaseNorthing
		],
		controller.updateApplicationsEditCaseGeographicalInformation
	);

applicationsEditCaseRouter
	.route('/regions')
	.get(controller.viewApplicationsEditCaseRegions)
	.post(
		validators.validateApplicationsCreateCaseRegions,
		controller.updateApplicationsEditCaseRegions
	);

applicationsEditCaseRouter
	.route('/zoom-level')
	.get(controller.viewApplicationsEditCaseZoomLevel)
	.post(controller.updateApplicationsEditCaseZoomLevel);

export default applicationsEditCaseRouter;
