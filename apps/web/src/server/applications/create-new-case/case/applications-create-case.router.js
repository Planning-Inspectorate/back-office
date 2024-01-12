import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { registerCaseWithQuery } from '../../applications.locals.js';
import * as controller from './applications-create-case.controller.js';
import * as validators from './applications-create-case.validators.js';

const applicationsCreateCaseRouter = createRouter();

applicationsCreateCaseRouter
	.route('/')
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

applicationsCreateCaseRouter
	.route('/sector')
	.get(
		registerCaseWithQuery(['sector'], true),
		asyncHandler(controller.viewApplicationsCreateCaseSector)
	)
	.post(
		validators.validateApplicationsCreateCaseSector,
		asyncHandler(controller.updateApplicationsCreateCaseSector)
	);

applicationsCreateCaseRouter
	.route('/sub-sector')
	.get(
		registerCaseWithQuery(['subSector', 'sector'], true),
		asyncHandler(controller.viewApplicationsCreateCaseSubSector)
	)
	.post(
		validators.validateApplicationsCreateCaseSubSector,
		asyncHandler(controller.updateApplicationsCreateCaseSubSector)
	);

applicationsCreateCaseRouter
	.route('/geographical-information')
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
	.route('/regions')
	.get(
		registerCaseWithQuery(['geographicalInformation'], true),
		asyncHandler(controller.viewApplicationsCreateCaseRegions)
	)
	.post(
		validators.validateApplicationsCreateCaseRegions,
		asyncHandler(controller.updateApplicationsCreateCaseRegions)
	);

applicationsCreateCaseRouter
	.route('/zoom-level')
	.get(
		registerCaseWithQuery(['geographicalInformation'], true),
		asyncHandler(controller.viewApplicationsCreateCaseZoomLevel)
	)
	.post(asyncHandler(controller.updateApplicationsCreateCaseZoomLevel));

applicationsCreateCaseRouter
	.route('/team-email')
	.get(
		registerCaseWithQuery(['caseEmail'], true),
		asyncHandler(controller.viewApplicationsCreateCaseTeamEmail)
	)
	.post(
		validators.validateApplicationsTeamEmail,
		asyncHandler(controller.updateApplicationsCreateCaseTeamEmail)
	);

export default applicationsCreateCaseRouter;
