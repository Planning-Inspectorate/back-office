import { Router as createRouter } from 'express';
import asyncRoute from '../../../../../lib/async-route.js';
import * as validators from '../../../create-new-case/case/applications-create-case.validators.js';
import * as controller from './applications-edit-case.controller.js';

const applicationsEditCaseRouter = createRouter();

applicationsEditCaseRouter
	.route('/name')
	.get(asyncRoute(controller.viewApplicationsEditCaseName))
	.post(
		[validators.validateApplicationsCreateCaseName],
		asyncRoute(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/description')
	.get(asyncRoute(controller.viewApplicationsEditCaseDescription))
	.post(
		[validators.validateApplicationsCreateCaseDescription],
		asyncRoute(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/team-email')
	.get(asyncRoute(controller.viewApplicationsEditCaseTeamEmail))
	.post(
		validators.validateApplicationsTeamEmail,
		asyncRoute(controller.updateApplicationsEditCaseTeamEmail)
	);

applicationsEditCaseRouter
	.route('/project-location')
	.get(asyncRoute(controller.viewApplicationsCreateCaseLocation))
	.post(
		validators.validateApplicationsCreateCaseLocation,
		asyncRoute(controller.updateApplicationsEditCaseGeographicalInformation)
	);

applicationsEditCaseRouter
	.route('/grid-references')
	.get(asyncRoute(controller.viewApplicationsCreateCaseGridReferences))
	.post(
		[
			validators.validateApplicationsCreateCaseEasting,
			validators.validateApplicationsCreateCaseNorthing
		],
		asyncRoute(controller.updateApplicationsEditCaseGeographicalInformation)
	);

applicationsEditCaseRouter
	.route('/regions')
	.get(asyncRoute(controller.viewApplicationsEditCaseRegions))
	.post(
		validators.validateApplicationsCreateCaseRegions,
		asyncRoute(controller.updateApplicationsEditCaseRegions)
	);

applicationsEditCaseRouter
	.route('/zoom-level')
	.get(asyncRoute(controller.viewApplicationsEditCaseZoomLevel))
	.post(asyncRoute(controller.updateApplicationsEditCaseZoomLevel));

export default applicationsEditCaseRouter;
