import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import { registerCaseWithQuery } from '../../../applications.locals.js';
import * as validators from '../../../create-new-case/case/applications-create-case.validators.js';
import * as controller from './applications-edit-case.controller.js';

const applicationsEditCaseRouter = createRouter();

applicationsEditCaseRouter
	.route('/name')
	.get(registerCaseWithQuery(['title']), asyncHandler(controller.viewApplicationsEditCaseName))
	.post(
		[validators.validateApplicationsCreateCaseName],
		asyncHandler(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/name-welsh')
	.get(
		registerCaseWithQuery(['title', 'titleWelsh']),
		asyncHandler(controller.viewApplicationsEditCaseNameWelsh)
	)
	.post(
		[validators.validateApplicationsCreateCaseNameWelsh],
		registerCaseWithQuery(['title', 'titleWelsh']),
		asyncHandler(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/description')
	.get(
		registerCaseWithQuery(['description']),
		asyncHandler(controller.viewApplicationsEditCaseDescription)
	)
	.post(
		[validators.validateApplicationsCreateCaseDescription],
		asyncHandler(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/description-welsh')
	.get(
		registerCaseWithQuery(['description', 'descriptionWelsh']),
		asyncHandler(controller.viewApplicationsEditCaseDescriptionWelsh)
	)
	.post(
		[validators.validateApplicationsCreateCaseDescriptionWelsh],
		registerCaseWithQuery(['description', 'descriptionWelsh']),
		asyncHandler(controller.updateApplicationsEditCaseNameAndDescription)
	);

applicationsEditCaseRouter
	.route('/team-email')
	.get(
		registerCaseWithQuery(['caseEmail']),
		asyncHandler(controller.viewApplicationsEditCaseTeamEmail)
	)
	.post(
		validators.validateApplicationsTeamEmail,
		asyncHandler(controller.updateApplicationsEditCaseTeamEmail)
	);

applicationsEditCaseRouter
	.route('/project-location')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncHandler(controller.viewApplicationsCreateCaseLocation)
	)
	.post(
		validators.validateApplicationsCreateCaseLocation,
		asyncHandler(controller.updateApplicationsEditCaseGeographicalInformation)
	);

applicationsEditCaseRouter
	.route('/project-location-welsh')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncHandler(controller.viewApplicationsCreateCaseLocationWelsh)
	)
	.post(
		validators.validateApplicationsCreateCaseLocationWelsh,
		registerCaseWithQuery(['geographicalInformation']),
		asyncHandler(controller.updateApplicationsEditCaseGeographicalInformation)
	);

applicationsEditCaseRouter
	.route('/grid-references')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncHandler(controller.viewApplicationsCreateCaseGridReferences)
	)
	.post(
		[
			validators.validateApplicationsCreateCaseEasting,
			validators.validateApplicationsCreateCaseNorthing
		],
		asyncHandler(controller.updateApplicationsEditCaseGeographicalInformation)
	);

applicationsEditCaseRouter
	.route('/regions')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncHandler(controller.viewApplicationsEditCaseRegions)
	)
	.post(
		validators.validateApplicationsCreateCaseRegions,
		asyncHandler(controller.updateApplicationsEditCaseRegions)
	);

applicationsEditCaseRouter
	.route('/zoom-level')
	.get(
		registerCaseWithQuery(['geographicalInformation']),
		asyncHandler(controller.viewApplicationsEditCaseZoomLevel)
	)
	.post(asyncHandler(controller.updateApplicationsEditCaseZoomLevel));

applicationsEditCaseRouter
	.route('/stage')
	.get(registerCaseWithQuery(['status']), asyncHandler(controller.viewApplicationsEditCaseStage))
	.post(
		validators.validateApplicationsCreateCaseStage,
		asyncHandler(controller.updateApplicationsEditCaseStage)
	);

applicationsEditCaseRouter
	.route('/material-change')
	.get(
		registerCaseWithQuery(['isMaterialChange']),
		asyncHandler(controller.viewApplicationsEditIsMaterialChange)
	)
	.post(asyncHandler(controller.updateApplicationsEditIsMaterialChange));

export default applicationsEditCaseRouter;
