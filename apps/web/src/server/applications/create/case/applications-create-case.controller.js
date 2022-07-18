import * as applicationsCreateCaseService from './applications-create-case.service.js';

/** @typedef {import('../../applications.router').DomainParams} DomainParams */
/** @typedef {import('../../applications.types').Sector} Sector */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseNameProps} ApplicationsCreateCaseNameProps */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseNameBody} ApplicationsCreateCaseNameBody */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseSectorProps} ApplicationsCreateCaseSectorProps */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseSectorBody} ApplicationsCreateCaseSectorBody */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseSubSectorProps} ApplicationsCreateCaseSubSectorProps */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseSubSectorBody} ApplicationsCreateCaseSubSectorBody */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseGeographicalInformationProps} ApplicationsCreateCaseGeographicalInformationProps */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseGeographicalInformationBody} ApplicationsCreateCaseGeographicalInformationBody */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseRegionsProps} ApplicationsCreateCaseRegionsProps */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseRegionsBody} ApplicationsCreateCaseRegionsBody */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseZoomLevelProps} ApplicationsCreateCaseZoomLevelProps */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseZoomLevelBody} ApplicationsCreateCaseZoomLevelBody */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseTeamEmailProps} ApplicationsCreateCaseTeamEmailProps */
/** @typedef {import('./applications-create-case.types').ApplicationsCreateCaseTeamEmailBody} ApplicationsCreateCaseTeamEmailBody */

/** @typedef {import('./applications-create-case.types').UpdateOrCreateCallback} UpdateOrCreateCallback */

/**
 * View the first step (name & description) of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseName(req, response) {
	const { applicationId } = response.locals || {};
	const { name: applicationName, description: applicationDescription } = applicationId
		? await applicationsCreateCaseService.getApplicationDraft(applicationId)
		: { name: '', description: '' };

	response.render('applications/create/case/_name', { applicationName, applicationDescription });
}

/**
 * Create the application with name and description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps,
 *   {}, ApplicationsCreateCaseNameBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseName({ errors, body }, response) {
	const { applicationName, applicationDescription } = body;
	const { applicationId } = response.locals;
	const updatedData = { name: applicationName, description: applicationDescription };

	if (errors) {
		return response.render('applications/create/case/_name', {
			errors,
			applicationDescription,
			applicationName
		});
	}

	const updateApplicationName = applicationId
		? () => applicationsCreateCaseService.updateApplicationDraft(applicationId, updatedData)
		: () => applicationsCreateCaseService.createApplicationDraft(updatedData);

	const updatedApplicationId = await getUpdatedApplicationIdOrFail(
		updateApplicationName,
		{
			templateName: 'name',
			templateData: { applicationDescription, applicationName }
		},
		response
	);

	response.redirect(`/applications-service/create-new-case/${updatedApplicationId}/sector`);
}

/**
 * View the sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseSector(req, response) {
	const { applicationId } = response.locals;
	const allSectors = await applicationsCreateCaseService.getAllSectors();

	const { sector: selectedSector } = await applicationsCreateCaseService.getApplicationDraft(
		applicationId
	);

	response.render('applications/create/case/_sector', {
		sectors: allSectors,
		selectedValue: selectedSector?.name || ''
	});
}

/**
 * Save the sector for the draft application
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSectorProps,
 * {}, ApplicationsCreateCaseSectorBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseSector({ errors, body }, response) {
	const { applicationId } = response.locals;
	const { selectedSectorName } = body;
	const allSectors = await applicationsCreateCaseService.getAllSectors();
	const selectedSector = allSectors.find((sector) => sector.name === selectedSectorName);
	const updateSector = () =>
		applicationsCreateCaseService.updateApplicationDraft(applicationId, { sector: selectedSector });

	if (errors) {
		return response.render('applications/create/case/_sector', { errors, sectors: allSectors });
	}

	await getUpdatedApplicationIdOrFail(
		updateSector,
		{
			templateName: 'sector',
			templateData: { sectors: allSectors }
		},
		response
	);
	response.redirect(`/applications-service/create-new-case/${applicationId}/sub-sector`);
}

/**
 * View the sub-sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSubSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseSubSector(req, response) {
	const { applicationId } = response.locals;
	const {
		sector,
		subSector: applicationSubSector
		// the hardcoded 'transport' value is just temporary. will be replaced once the resume api will be working
	} = await applicationsCreateCaseService.getApplicationDraft(applicationId, 'transport');

	const subSectors = await applicationsCreateCaseService.getSubSectorsBySector(sector);

	response.render('applications/create/case/_sub-sector', {
		subSectors,
		selectedValue: applicationSubSector?.name
	});
}

/**
 * Save the sub-sector for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSubSectorProps,
 * {}, ApplicationsCreateCaseSubSectorBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseSubSector({ errors, body }, response) {
	const { applicationId } = response.locals;
	const { selectedSubSectorName } = body;
	const { sector: applicationSector } = await applicationsCreateCaseService.getApplicationDraft(
		applicationId,
		'transport'
	);
	const subSectors = await applicationsCreateCaseService.getSubSectorsBySector(applicationSector);
	const selectedSubSector = subSectors.find(
		(subSector) => subSector.name === selectedSubSectorName
	);
	const updateSubSector = () =>
		applicationsCreateCaseService.updateApplicationDraft(applicationId, {
			subSector: selectedSubSector
		});

	if (errors) {
		return response.render('applications/create/case/_sub-sector', { errors, subSectors });
	}

	await getUpdatedApplicationIdOrFail(
		updateSubSector,
		{
			templateName: 'sub-sector',
			templateData: { subSectors }
		},
		response
	);
	response.redirect(
		`/applications-service/create-new-case/${applicationId}/geographical-information`
	);
}

/**
 * View the geographical information step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseGeographicalInformation(req, response) {
	const { applicationId } = response.locals;
	const { geographicalInformation } = await applicationsCreateCaseService.getApplicationDraft(
		applicationId
	);
	const { locationDescription: applicationLocation, gridReference } = geographicalInformation || {};
	const { northing: applicationNorthing, easting: applicationEasting } = gridReference || {};
	const templateData = { applicationLocation, applicationEasting, applicationNorthing };

	response.render('applications/create/case/_geographical-information', templateData);
}

/**
 * Save the geographical location for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps,
 * {}, ApplicationsCreateCaseGeographicalInformationBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseGeographicalInformation(
	{ errors, body },
	response
) {
	const { applicationId } = response.locals;
	const { applicationLocation, applicationEasting, applicationNorthing } = body;
	const templateData = { applicationLocation, applicationEasting, applicationNorthing };
	const updateGeographicalInformation = () =>
		applicationsCreateCaseService.updateApplicationDraft(applicationId, templateData);

	if (errors) {
		return response.render('applications/create/case/_geographical-information', {
			errors,
			...templateData
		});
	}

	await getUpdatedApplicationIdOrFail(
		updateGeographicalInformation,
		{
			templateName: '_geographical-information',
			templateData
		},
		response
	);

	response.redirect(`/applications-service/create-new-case/${applicationId}/regions`);
}

/**
 * View the regions step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseRegionsProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseRegions(req, response) {
	const allRegions = await applicationsCreateCaseService.getAllRegions();

	return response.render('applications/create/case/_region', { regions: allRegions });
}

/**
 * Save the regions for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseRegionsProps,
 * {}, ApplicationsCreateCaseRegionsBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseRegions({ errors, body }, response) {
	const { applicationId } = response.locals;
	const { selectedRegionsNames } = body;
	const allRegions = await applicationsCreateCaseService.getAllRegions();
	const selectedRegions = allRegions.filter((region) =>
		(selectedRegionsNames || []).includes(region.name)
	);
	const updateRegion = () =>
		applicationsCreateCaseService.updateApplicationDraft(applicationId, {
			regions: selectedRegions
		});

	if (errors) {
		return response.render('applications/create/case/_region', { errors, regions: allRegions });
	}

	await getUpdatedApplicationIdOrFail(
		updateRegion,
		{
			templateName: 'region',
			templateData: { regions: allRegions }
		},
		response
	);
	response.redirect(`/applications-service/create-new-case/${applicationId}/zoom-level`);
}

/**
 * View the zoom-level step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseZoomLevel(req, response) {
	const allZoomLevels = await applicationsCreateCaseService.getAllZoomLevels();

	allZoomLevels.sort((a, b) => ((a.displayOrder || '') < (b.displayOrder || '') ? 1 : -1));

	return response.render('applications/create/case/_zoom-level', { zoomLevels: allZoomLevels });
}

/**
 * Save the zoom-level for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, ApplicationsCreateCaseZoomLevelBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseZoomLevel({ body }, response) {
	const { applicationId } = response.locals;
	const { selectedZoomLevelName } = body;
	const allZoomLevels = await applicationsCreateCaseService.getAllZoomLevels();
	const selectedZoomLevel = allZoomLevels.filter(
		(zoomLevel) => selectedZoomLevelName === zoomLevel.name
	);
	const updateZoomLevel = () =>
		applicationsCreateCaseService.updateApplicationDraft(applicationId, {
			zoomLevel: selectedZoomLevel
		});

	await getUpdatedApplicationIdOrFail(
		updateZoomLevel,
		{
			templateName: 'zoom-level',
			templateData: { zoomLevels: allZoomLevels }
		},
		response
	);
	response.redirect(`/applications-service/create-new-case/${applicationId}/team-email`);
}

/**
 * View the case-team email address step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseTeamEmail(req, response) {
	const { applicationId } = response.locals;
	const { teamEmail: applicationTeamEmail } =
		await applicationsCreateCaseService.getApplicationDraft(applicationId);

	return response.render('applications/create/case/_team-email', { applicationTeamEmail });
}

/**
 * View the case-team email address step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, ApplicationsCreateCaseTeamEmailBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseTeamEmail({ body, errors }, response) {
	const { applicationId } = response.locals;
	const { applicationTeamEmail } = body;
	const templateData = { applicationTeamEmail };
	const updateTeamEmail = () =>
		applicationsCreateCaseService.updateApplicationDraft(applicationId, templateData);

	if (errors) {
		return response.render('applications/create/case/_team-email', {
			errors,
			...templateData
		});
	}

	await getUpdatedApplicationIdOrFail(
		updateTeamEmail,
		{
			templateName: 'team-email',
			templateData
		},
		response
	);

	response.redirect(
		`/applications-service/create-new-case/${applicationId}/applicant-information-types`
	);
}

/**
 * Handles the update of the draft application and possible server errors
 *
 * @param {UpdateOrCreateCallback} updateOrCreateDraftApplication
 * @param {{templateName: string, templateData: object}} errorsViewParameters
 * @param {any} response
 * @returns {Promise<string>}
 */
async function getUpdatedApplicationIdOrFail(
	updateOrCreateDraftApplication,
	errorsViewParameters,
	response
) {
	const { templateName, templateData } = errorsViewParameters;
	const outcome = await updateOrCreateDraftApplication();
	const { errors, id: updatedApplicationId } = outcome;

	if (!updatedApplicationId) {
		return response.render(`/applications/create/case/_${templateName}`, {
			...errors,
			...templateData
		});
	}

	return updatedApplicationId;
}
