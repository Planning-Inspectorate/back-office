import * as applicationsCreateService from './applications-create.service.js';

/** @typedef {import('../applications.router').DomainParams} DomainParams */
/** @typedef {import('../applications.types').Sector} Sector */
/** @typedef {import('./applications-create.types').ApplicationsCreateNameProps} ApplicationsCreateNameProps */
/** @typedef {import('./applications-create.types').ApplicationsCreateNameBody} ApplicationsCreateNameBody */
/** @typedef {import('./applications-create.types').ApplicationsCreateSectorProps} ApplicationsCreateSectorProps */
/** @typedef {import('./applications-create.types').ApplicationsCreateSectorBody} ApplicationsCreateSectorBody */
/** @typedef {import('./applications-create.types').ApplicationsCreateSubSectorProps} ApplicationsCreateSubSectorProps */
/** @typedef {import('./applications-create.types').ApplicationsCreateSubSectorBody} ApplicationsCreateSubSectorBody */
/** @typedef {import('./applications-create.types').ApplicationsCreateGeographicalInformationProps} ApplicationsCreateGeographicalInformationProps */
/** @typedef {import('./applications-create.types').ApplicationsCreateGeographicalInformationBody} ApplicationsCreateGeographicalInformationBody */
/** @typedef {import('./applications-create.types').ApplicationsCreateRegionsProps} ApplicationsCreateRegionsProps */
/** @typedef {import('./applications-create.types').ApplicationsCreateRegionsBody} ApplicationsCreateRegionsBody */
/** @typedef {import('./applications-create.types').ApplicationsCreateTeamEmailProps} ApplicationsCreateTeamEmailProps */
/** @typedef {import('./applications-create.types').ApplicationsCreateTeamEmailBody} ApplicationsCreateTeamEmailBody */

/** @typedef {import('./applications-create.types').UpdateOrCreateCallback} UpdateOrCreateCallback */

/**
 * View the first step (name & description) of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateNameProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateName({ params }, response) {
	const { applicationId } = params;
	const { name: applicationName, description: applicationDescription } = applicationId
		? await applicationsCreateService.getApplicationDraft(applicationId)
		: { name: '', description: '' };

	response.render('applications/create/_name', { applicationName, applicationDescription });
}

/**
 * Create the application with name and description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateNameProps,
 *   {}, ApplicationsCreateNameBody, {}, DomainParams>}
 */
export async function newApplicationsCreateName({ errors, body, params }, response) {
	const { applicationName, applicationDescription } = body;
	const { applicationId } = params;
	const updatedData = { name: applicationName, description: applicationDescription };

	if (errors) {
		return response.render('applications/create/_name', {
			errors,
			applicationDescription,
			applicationName
		});
	}

	const updateApplicationName = applicationId
		? () => applicationsCreateService.updateApplicationDraft(applicationId, updatedData)
		: () => applicationsCreateService.createApplicationDraft(updatedData);

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
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateSector({ params }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const allSectors = await applicationsCreateService.getAllSectors();

	const { sector: selectedSector } = await applicationsCreateService.getApplicationDraft(
		applicationId
	);

	response.render('applications/create/_sector', {
		sectors: allSectors,
		selectedValue: selectedSector?.name || ''
	});
}

/**
 * Save the sector for the draft application
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateSectorProps,
 * {}, ApplicationsCreateSectorBody, {}, DomainParams>}
 */
export async function newApplicationsCreateSector({ errors, params, body }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { selectedSectorName } = body;
	const allSectors = await applicationsCreateService.getAllSectors();
	const selectedSector = allSectors.find((sector) => sector.name === selectedSectorName);
	const updateSector = () =>
		applicationsCreateService.updateApplicationDraft(applicationId, { sector: selectedSector });

	if (errors) {
		return response.render('applications/create/_sector', { errors, sectors: allSectors });
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
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateSubSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateSubSector({ params }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const {
		sector,
		subSector: applicationSubSector
		// the hardcoded 'transport' value is just temporary. will be replaced once the resume api will be working
	} = await applicationsCreateService.getApplicationDraft(applicationId, 'transport');

	const subSectors = await applicationsCreateService.getSubSectorsBySector(sector);

	response.render('applications/create/_sub-sector', {
		subSectors,
		selectedValue: applicationSubSector?.name
	});
}

/**
 * Save the sub-sector for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateSubSectorProps,
 * {}, ApplicationsCreateSubSectorBody, {}, DomainParams>}
 */
export async function newApplicationsCreateSubSector({ errors, params, body }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { selectedSubSectorName } = body;
	const { sector: applicationSector } = await applicationsCreateService.getApplicationDraft(
		applicationId,
		'transport'
	);
	const subSectors = await applicationsCreateService.getSubSectorsBySector(applicationSector);
	const selectedSubSector = subSectors.find(
		(subSector) => subSector.name === selectedSubSectorName
	);
	const updateSubSector = () =>
		applicationsCreateService.updateApplicationDraft(applicationId, {
			subSector: selectedSubSector
		});

	if (errors) {
		return response.render('applications/create/_sub-sector', { errors, subSectors });
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
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateGeographicalInformationProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateGeographicalInformation({ params }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { geographicalInformation } = await applicationsCreateService.getApplicationDraft(
		applicationId
	);
	const { locationDescription: applicationLocation, gridReference } = geographicalInformation || {};
	const { northing: applicationNorthing, easting: applicationEasting } = gridReference || {};
	const templateData = { applicationLocation, applicationEasting, applicationNorthing };

	response.render('applications/create/_geographical-information', templateData);
}

/**
 * Save the geographical location for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateGeographicalInformationProps,
 * {}, ApplicationsCreateGeographicalInformationBody, {}, DomainParams>}
 */
export async function newApplicationsCreateGeographicalInformation(
	{ errors, params, body },
	response
) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { applicationLocation, applicationEasting, applicationNorthing } = body;
	const templateData = { applicationLocation, applicationEasting, applicationNorthing };
	const updateGeographicalInformation = () =>
		applicationsCreateService.updateApplicationDraft(applicationId, templateData);

	if (errors) {
		return response.render('applications/create/_geographical-information', {
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
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateRegionsProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateRegions(req, response) {
	const allRegions = await applicationsCreateService.getAllRegions();

	return response.render('applications/create/_region', { regions: allRegions });
}

/**
 * Save the regions for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateRegionsProps,
 * {}, ApplicationsCreateRegionsBody, {}, DomainParams>}
 */
export async function newApplicationsCreateRegions({ errors, params, body }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { selectedRegionsNames } = body;
	const allRegions = await applicationsCreateService.getAllRegions();
	const selectedRegions = allRegions.filter((region) =>
		(selectedRegionsNames || []).includes(region.name)
	);
	const updateRegion = () =>
		applicationsCreateService.updateApplicationDraft(applicationId, { regions: selectedRegions });

	if (errors) {
		return response.render('applications/create/_region', { errors, regions: allRegions });
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
 * @type {import('@pins/express').RenderHandler<{},{}>}
 */
export async function viewApplicationsCreateZoomLevel(req, response) {
	return response.render('applications/create/_zoom-level');
}

/**
 * Save the zoom-level for the draft application
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function newApplicationsCreateZoomLevel(req, response) {
	response.redirect(`/applications-service/create-new-case/123/team-email`);
}

/**
 * View the case-team email address step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateTeamEmailProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateTeamEmail({ params }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { teamEmail: applicationTeamEmail } = applicationId
		? await applicationsCreateService.getApplicationDraft(applicationId)
		: { teamEmail: '' };

	return response.render('applications/create/_team-email', { applicationTeamEmail });
}

/**
 * View the case-team email address step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateTeamEmailProps,
 * {}, ApplicationsCreateTeamEmailBody, {}, DomainParams>}
 */
export async function newApplicationsCreateTeamEmail({ body, errors, params }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { applicationTeamEmail } = body;
	const templateData = { applicationTeamEmail };
	const updateTeamEmail = () =>
		applicationsCreateService.updateApplicationDraft(applicationId, templateData);

	if (errors) {
		return response.render('applications/create/_team-email', {
			errors,
			...templateData
		});
	}

	await getUpdatedApplicationIdOrFail(
		updateTeamEmail,
		{
			templateName: '_team-email',
			templateData
		},
		response
	);

	response.redirect(`/applications-service/create-new-case/${applicationId}/applicant-type`);
}

/**
 * Make sure that URL contains applicationId or fail
 *
 * @param {{applicationId?: string}} params
 * @param {any} response
 * @returns {string}
 */
function getParametersApplicationIdOrFail({ applicationId }, response) {
	return applicationId ?? response.redirect('/app/404');
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
		return response.render(`/applications/create/_${templateName}`, { ...errors, ...templateData });
	}

	return updatedApplicationId;
}
