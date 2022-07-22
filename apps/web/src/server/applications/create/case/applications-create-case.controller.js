import { bodyToPayload, bodyToValues } from '../../../lib/body-formatter.js';
import * as applicationsCreateService from '../applications-create.service.js';
import * as applicationsCreateCaseService from './applications-create-case.service.js';
import {
	destroySessionCaseSectorName,
	getSessionCaseSectorName,
	setSessionCaseSectorName
} from './applications-create-case-session.service.js';

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
	const resumedApplication = applicationId
		? await applicationsCreateService.getApplicationDraft(applicationId)
		: { title: '', description: '' };
	const templateData = { values: resumedApplication };

	response.render('applications/create/case/_name', templateData);
}

/**
 * Create the application with name and description
 *
 * @type {import('@pins/express').RenderHandler<*, *>}
 */
export async function updateApplicationsCreateCaseName(
	{ errors: validationErrors, session, body },
	response
) {
	const { applicationId } = response.locals;
	const templateData = bodyToValues(body);
	const payload = bodyToPayload(body);

	const updateOrCreateApplicationName = applicationId
		? () => applicationsCreateService.updateApplicationDraft(applicationId, payload)
		: () => applicationsCreateService.createApplicationDraft(payload, session);

	const { errors: apiErrors, id: updatedApplicationId } = await updateOrCreateApplicationName();
	const errors = validationErrors || apiErrors;

	if (errors) {
		return response.render('applications/create/case/_name', {
			errors,
			...templateData
		});
	}

	response.redirect(`/applications-service/create-new-case/${updatedApplicationId}/sector`);
}

/**
 * View the sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseSector({ session }, response) {
	const { applicationId } = response.locals;
	const allSectors = await applicationsCreateCaseService.getAllSectors();

	const { sector: selectedSector } = await applicationsCreateService.getApplicationDraft(
		applicationId
	);
	const selectedSectorName = selectedSector?.name || getSessionCaseSectorName(session);

	response.render('applications/create/case/_sector', {
		sectors: allSectors,
		selectedValue: selectedSectorName || ''
	});
}

/**
 * Save the sector for the draft application
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSectorProps,
 * {}, ApplicationsCreateCaseSectorBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseSector({ errors, session, body }, response) {
	const { applicationId } = response.locals;
	const { selectedSectorName } = body;
	const allSectors = await applicationsCreateCaseService.getAllSectors();

	if (errors) {
		return response.render('applications/create/case/_sector', { errors, sectors: allSectors });
	}

	setSessionCaseSectorName(session, selectedSectorName);
	response.redirect(`/applications-service/create-new-case/${applicationId}/sub-sector`);
}

/**
 * View the sub-sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<*, *>}
 */
export async function viewApplicationsCreateCaseSubSector({ session }, response) {
	const { applicationId } = response.locals;
	const { sector: selectedSector, subSector: selectedSubSector } =
		await applicationsCreateService.getApplicationDraft(applicationId);
	const selectedSectorName = getSessionCaseSectorName(session) || selectedSector?.name;

	if (!selectedSectorName) {
		return response.redirect(`/applications-service/create-new-case/${applicationId}/sector`);
	}

	const subSectors = await applicationsCreateCaseService.getSubSectorsBySectorName(
		selectedSectorName
	);

	response.render('applications/create/case/_sub-sector', {
		subSectors,
		values: { subSectorName: selectedSubSector.name }
	});
}

/**
 * Save the sub-sector for the draft application
 *
 * @type {import('@pins/express').RenderHandler<*, *>}
 */
export async function updateApplicationsCreateCaseSubSector(
	{ session, error: validationErrors, body },
	response
) {
	const { applicationId } = response.locals;
	const templateData = bodyToValues(body);
	const payload = bodyToPayload(body);
	const { sector: selectedSector } = await applicationsCreateService.getApplicationDraft(
		applicationId
	);
	const selectedSectorName = getSessionCaseSectorName(session) || selectedSector?.name;

	const subSectors = await applicationsCreateCaseService.getSubSectorsBySectorName(
		selectedSectorName || ''
	);

	const { errors: apiErrors, id: updatedApplicationId } =
		await applicationsCreateService.updateApplicationDraft(applicationId, payload);
	const errors = validationErrors || apiErrors;

	if (errors) {
		return response.render('applications/create/case/_sub-sector', {
			errors,
			subSectors,
			...templateData
		});
	}

	destroySessionCaseSectorName(session);
	response.redirect(
		`/applications-service/create-new-case/${updatedApplicationId}/geographical-information`
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
	const { geographicalInformation } = await applicationsCreateService.getApplicationDraft(
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
	{ errors: validationErrors, body },
	response
) {
	const { applicationId } = response.locals;
	const templateData = { values: bodyToValues(body) };
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedApplicationId } =
		await applicationsCreateService.updateApplicationDraft(applicationId, payload);
	const errors = validationErrors || apiErrors;

	if (errors) {
		return response.render('applications/create/case/_geographical-information', {
			errors,
			...templateData
		});
	}

	response.redirect(`/applications-service/create-new-case/${updatedApplicationId}/regions`);
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
		applicationsCreateService.updateApplicationDraft(applicationId, {
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
		applicationsCreateService.updateApplicationDraft(applicationId, {
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
	const { teamEmail: applicationTeamEmail } = await applicationsCreateService.getApplicationDraft(
		applicationId
	);

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
		applicationsCreateService.updateApplicationDraft(applicationId, templateData);

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
 * @returns {Promise<number>}
 */
async function getUpdatedApplicationIdOrFail(
	updateOrCreateDraftApplication,
	errorsViewParameters,
	response
) {
	const { templateName } = errorsViewParameters;
	const { id: updatedApplicationId } = await updateOrCreateDraftApplication();

	if (!updatedApplicationId) {
		return response.render(`applications/create/case/_${templateName}`);
	}

	return updatedApplicationId;
}
