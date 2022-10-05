import { Router as createRouter } from 'express';
import * as controller from './applications-create-case.controller.js';
import * as validators from './applications-create-case.validators.js';

const applicationsCreateCaseRouter = createRouter();

applicationsCreateCaseRouter
	.route('/')
	.get(controller.viewApplicationsCreateCaseName)
	.post(
		[
			validators.validateApplicationsCreateCaseName,
			validators.validateApplicationsCreateCaseDescription
		],
		controller.updateApplicationsCreateCaseName
	);

applicationsCreateCaseRouter
	.route('/sector')
	.get(controller.viewApplicationsCreateCaseSector)
	.post(
		validators.validateApplicationsCreateCaseSector,
		controller.updateApplicationsCreateCaseSector
	);

applicationsCreateCaseRouter
	.route('/sub-sector')
	.get(controller.viewApplicationsCreateCaseSubSector)
	.post(
		validators.validateApplicationsCreateCaseSubSector,
		controller.updateApplicationsCreateCaseSubSector
	);

applicationsCreateCaseRouter
	.route('/geographical-information')
	.get(controller.viewApplicationsCreateCaseGeographicalInformation)
	.post(
		[
			validators.validateApplicationsCreateCaseLocation,
			validators.validateApplicationsCreateCaseEasting,
			validators.validateApplicationsCreateCaseNorthing
		],
		controller.updateApplicationsCreateCaseGeographicalInformation
	);

applicationsCreateCaseRouter
	.route('/regions')
	.get(controller.viewApplicationsCreateCaseRegions)
	.post(
		validators.validateApplicationsCreateCaseRegions,
		controller.updateApplicationsCreateCaseRegions
	);

applicationsCreateCaseRouter
	.route('/zoom-level')
	.get(controller.viewApplicationsCreateCaseZoomLevel)
	.post(controller.updateApplicationsCreateCaseZoomLevel);

applicationsCreateCaseRouter
	.route('/team-email')
	.get(controller.viewApplicationsCreateCaseTeamEmail)
	.post(validators.validateApplicationsTeamEmail, controller.updateApplicationsCreateCaseTeamEmail);

export default applicationsCreateCaseRouter;
