import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { registerCaseWithQuery } from '../../applications.locals.js';
import * as controller from './applications-create-case.controller.js';
import * as validators from './applications-create-case.validators.js';

const applicationsCreateCaseRouter = createRouter();

applicationsCreateCaseRouter
	.route('/sector/:edit?')
	.get(
		registerCaseWithQuery(['sector'], true),
		asyncHandler(controller.viewApplicationsCreateCaseSector)
	)
	.post(
		validators.validateApplicationsCreateCaseSector,
		asyncHandler(controller.updateApplicationsCreateCaseSector)
	);

applicationsCreateCaseRouter
	.route('/sub-sector/:edit?')
	.get(
		registerCaseWithQuery(['subSector', 'sector'], true),
		asyncHandler(controller.viewApplicationsCreateCaseSubSector)
	)
	.post(
		validators.validateApplicationsCreateCaseSubSector,
		asyncHandler(controller.updateApplicationsCreateCaseSubSector)
	);

applicationsCreateCaseRouter
	.route('/geographical-information/:edit?')
	.get(
		registerCaseWithQuery(['geographicalInformation'], true),
		asyncHandler(controller.viewApplicationsCreateCaseGeographicalInformation)
	)
	.post(
		[
			validators.validateApplicationsCreateCaseLocation,
			validators.validateApplicationsCreateCaseEasting,
			validators.validateApplicationsCreateCaseNorthing
		],
		asyncHandler(controller.updateApplicationsCreateCaseGeographicalInformation)
	);

applicationsCreateCaseRouter
	.route('/regions/:edit?')
	.get(
		registerCaseWithQuery(['geographicalInformation'], true),
		asyncHandler(controller.viewApplicationsCreateCaseRegions)
	)
	.post(
		validators.validateApplicationsCreateCaseRegions,
		asyncHandler(controller.updateApplicationsCreateCaseRegions)
	);

applicationsCreateCaseRouter
	.route('/zoom-level/:edit?')
	.get(
		registerCaseWithQuery(['geographicalInformation'], true),
		asyncHandler(controller.viewApplicationsCreateCaseZoomLevel)
	)
	.post(asyncHandler(controller.updateApplicationsCreateCaseZoomLevel));

applicationsCreateCaseRouter
	.route('/team-email/:edit?')
	.get(
		registerCaseWithQuery(['caseEmail'], true),
		asyncHandler(controller.viewApplicationsCreateCaseTeamEmail)
	)
	.post(
		validators.validateApplicationsTeamEmail,
		asyncHandler(controller.updateApplicationsCreateCaseTeamEmail)
	);

applicationsCreateCaseRouter
	.route(['/', '/title/:edit'])
	.get(
		registerCaseWithQuery(['title', 'description'], true),
		asyncHandler(controller.viewApplicationsCreateCaseName)
	)
	.post(
		[
			validators.validateApplicationsCreateCaseName,
			validators.validateApplicationsCreateCaseDescription
		],
		asyncHandler(controller.updateApplicationsCreateCaseName)
	);

export default applicationsCreateCaseRouter;
