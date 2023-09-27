import { Router as createRouter } from 'express';
import asyncRoute from '../../../../lib/async-route.js';
import { registerCaseWithQuery } from '../../../applications.locals.js';
import * as validators from '../../../create-new-case/case/applications-create-case.validators.js';
import * as controller from './applications-edit-case.controller.js';

const applicationsEditCaseRouter = createRouter();

applicationsEditCaseRouter
	.route('/name')
	.get(registerCaseWithQuery(['title']), asyncRoute(controller.viewApplicationsEditCaseName))
	.post(
		[validators.validateApplicationsCreateCaseName],
		asyncRoute(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/description')
	.get(
		registerCaseWithQuery(['description']),
		asyncRoute(controller.viewApplicationsEditCaseDescription)
	)
	.post(
		[validators.validateApplicationsCreateCaseDescription],
		asyncRoute(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/team-email')
	.get(
		registerCaseWithQuery(['caseEmail']),
		asyncRoute(controller.viewApplicationsEditCaseTeamEmail)
	)
	.post(
		validators.validateApplicationsTeamEmail,
		asyncRoute(controller.updateApplicationsEditCaseTeamEmail)
	);

applicationsEditCaseRouter
	.route('/project-location')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncRoute(controller.viewApplicationsCreateCaseLocation)
	)
	.post(
		validators.validateApplicationsCreateCaseLocation,
		asyncRoute(controller.updateApplicationsEditCaseGeographicalInformation)
	);

applicationsEditCaseRouter
	.route('/grid-references')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncRoute(controller.viewApplicationsCreateCaseGridReferences)
	)
	.post(
		[
			validators.validateApplicationsCreateCaseEasting,
			validators.validateApplicationsCreateCaseNorthing
		],
		asyncRoute(controller.updateApplicationsEditCaseGeographicalInformation)
	);

applicationsEditCaseRouter
	.route('/regions')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncRoute(controller.viewApplicationsEditCaseRegions)
	)
	.post(
		validators.validateApplicationsCreateCaseRegions,
		asyncRoute(controller.updateApplicationsEditCaseRegions)
	);

applicationsEditCaseRouter
	.route('/zoom-level')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncRoute(controller.viewApplicationsEditCaseZoomLevel)
	)
	.post(asyncRoute(controller.updateApplicationsEditCaseZoomLevel));

applicationsEditCaseRouter
	.route('/stage')
	.get(registerCaseWithQuery(['status']), asyncRoute(controller.viewApplicationsEditCaseStage))
	.post(
		validators.validateApplicationsCreateCaseStage,
		asyncRoute(controller.updateApplicationsEditCaseStage)
	);

export default applicationsEditCaseRouter;
