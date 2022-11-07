import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import * as controller from './applications-create-case.controller.js';
import * as validators from './applications-create-case.validators.js';

const applicationsCreateCaseRouter = createRouter();

applicationsCreateCaseRouter
	.route('/')
	.get(asyncRoute(controller.viewApplicationsCreateCaseName))
	.post(
		[
			validators.validateApplicationsCreateCaseName,
			validators.validateApplicationsCreateCaseDescription
		],
		asyncRoute(controller.updateApplicationsCreateCaseName)
	);

applicationsCreateCaseRouter
	.route('/sector')
	.get(asyncRoute(controller.viewApplicationsCreateCaseSector))
	.post(
		validators.validateApplicationsCreateCaseSector,
		asyncRoute(controller.updateApplicationsCreateCaseSector)
	);

applicationsCreateCaseRouter
	.route('/sub-sector')
	.get(asyncRoute(controller.viewApplicationsCreateCaseSubSector))
	.post(
		validators.validateApplicationsCreateCaseSubSector,
		asyncRoute(controller.updateApplicationsCreateCaseSubSector)
	);

applicationsCreateCaseRouter
	.route('/geographical-information')
	.get(asyncRoute(controller.viewApplicationsCreateCaseGeographicalInformation))
	.post(
		[
			validators.validateApplicationsCreateCaseLocation,
			validators.validateApplicationsCreateCaseEasting,
			validators.validateApplicationsCreateCaseNorthing
		],
		asyncRoute(controller.updateApplicationsCreateCaseGeographicalInformation)
	);

applicationsCreateCaseRouter
	.route('/regions')
	.get(asyncRoute(controller.viewApplicationsCreateCaseRegions))
	.post(
		validators.validateApplicationsCreateCaseRegions,
		asyncRoute(controller.updateApplicationsCreateCaseRegions)
	);

applicationsCreateCaseRouter
	.route('/zoom-level')
	.get(asyncRoute(controller.viewApplicationsCreateCaseZoomLevel))
	.post(asyncRoute(controller.updateApplicationsCreateCaseZoomLevel));

applicationsCreateCaseRouter
	.route('/team-email')
	.get(asyncRoute(controller.viewApplicationsCreateCaseTeamEmail))
	.post(
		validators.validateApplicationsTeamEmail,
		asyncRoute(controller.updateApplicationsCreateCaseTeamEmail)
	);

export default applicationsCreateCaseRouter;
