import { bodyToPayload } from '../../../lib/body-formatter.js';
import pino from '../../../lib/logger.js';
import {
	createApplicationDraft,
	getApplicationDraft,
	updateApplicationDraft
} from '../applications-create.service.js';
import {
	getAllRegions,
	getAllSectors,
	getAllZoomLevels,
	getSubSectorsBySectorName
} from './applications-create-case.service.js';
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

/**
 * View the first step (name & description) of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseName(req, response) {
	const { applicationId } = response.locals || {};
	const { title, description } = applicationId
		? await getApplicationDraft(applicationId)
		: { title: '', description: '' };

	response.render('applications/create/case/_name', { values: { title, description } });
}

/**
 * Create the application with name and description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps,
 * {}, ApplicationsCreateCaseNameBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseName(
	{ errors: validationErrors, session, body },
	response
) {
	const { applicationId } = response.locals;
	const { description, title } = body;
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedApplicationId } = await (applicationId
		? () => updateApplicationDraft(applicationId, payload)
		: () => createApplicationDraft(payload, session))();

	if (validationErrors || apiErrors || !updatedApplicationId) {
		return response.render('applications/create/case/_name', {
			errors: validationErrors || apiErrors,
			values: { description, title }
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
	const allSectors = await getAllSectors();

	const { sector } = await getApplicationDraft(applicationId);
	const selectedSectorName = getSessionCaseSectorName(session) || sector?.name;

	response.render('applications/create/case/_sector', {
		sectors: allSectors,
		values: { sectorName: selectedSectorName || '' }
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
	const { sectorName } = body;

	if (errors) {
		const allSectors = await getAllSectors();

		return response.render('applications/create/case/_sector', {
			errors,
			sectors: allSectors,
			values: { sectorName }
		});
	}

	setSessionCaseSectorName(session, sectorName);
	response.redirect(`/applications-service/create-new-case/${applicationId}/sub-sector`);
}

/**
 * View the sub-sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<*, *>}
 */
export async function viewApplicationsCreateCaseSubSector({ session }, response) {
	const { applicationId } = response.locals;
	const { sector, subSector } = await getApplicationDraft(applicationId);
	const selectedSectorName = getSessionCaseSectorName(session) || sector?.name;

	if (!selectedSectorName) {
		pino.warn('Trying to change subsector with no sector value registered. Redirect to sector');

		return response.redirect(`/applications-service/create-new-case/${applicationId}/sector`);
	}

	const subSectors = await getSubSectorsBySectorName(selectedSectorName);

	response.render('applications/create/case/_sub-sector', {
		subSectors: subSectors || [],
		values: { subSectorName: subSector?.name }
	});
}

/**
 * Save the sub-sector for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSubSectorProps,
 * {}, ApplicationsCreateCaseSubSectorBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseSubSector(
	{ session, errors: validationErrors, body },
	response
) {
	const { applicationId } = response.locals;
	const { subSectorName } = body;
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedApplicationId } = await updateApplicationDraft(
		applicationId,
		payload
	);

	if (validationErrors || apiErrors || !updatedApplicationId) {
		const { sector } = await getApplicationDraft(applicationId);
		const selectedSectorName = getSessionCaseSectorName(session) || sector?.name;
		const subSectors = await getSubSectorsBySectorName(selectedSectorName);

		return response.render('applications/create/case/_sub-sector', {
			errors: validationErrors || apiErrors,
			subSectors,
			values: { subSectorName }
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
	const { geographicalInformation } = await getApplicationDraft(applicationId);
	const { locationDescription, gridReference } = geographicalInformation || {};
	const values = {
		'geographicalInformation.locationDescription': locationDescription,
		'geographicalInformation.gridReference.easting': gridReference?.easting,
		'geographicalInformation.gridReference.northing': gridReference?.northing
	};

	response.render('applications/create/case/_geographical-information', { values });
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
	const payload = bodyToPayload(body);
	const values = {
		'geographicalInformation.locationDescription':
			body['geographicalInformation.locationDescription'],
		'geographicalInformation.gridReference.easting':
			body['geographicalInformation.gridReference.easting'],
		'geographicalInformation.gridReference.northing':
			body['geographicalInformation.gridReference.northing']
	};

	const { errors: apiErrors, id: updatedApplicationId } = await updateApplicationDraft(
		applicationId,
		payload
	);

	if (validationErrors || apiErrors || !updatedApplicationId) {
		return response.render('applications/create/case/_geographical-information', {
			errors: validationErrors || apiErrors,
			values
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
	const { applicationId } = response.locals;
	const allRegions = await getAllRegions();
	const { geographicalInformation } = await getApplicationDraft(applicationId);
	const selectedRegionNames = new Set(
		(geographicalInformation?.regions || []).map((region) => region?.name)
	);

	const checkBoxRegions = allRegions.map((region) => ({
		text: region.displayNameEn,
		value: region.name,
		checked: selectedRegionNames.has(region.name)
	}));

	return response.render('applications/create/case/_region', { regions: checkBoxRegions });
}

/**
 * Save the regions for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseRegionsProps,
 * {}, ApplicationsCreateCaseRegionsBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseRegions(
	{ errors: validationErrors, body },
	response
) {
	const { applicationId } = response.locals;
	const selectedRegionNames = new Set(body['geographicalInformation.regionNames'] || []);
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedApplicationId } = await updateApplicationDraft(
		applicationId,
		payload
	);

	if (validationErrors || apiErrors || !updatedApplicationId) {
		const allRegions = await getAllRegions();
		const checkBoxRegions = allRegions.map((region) => ({
			text: region.displayNameEn,
			value: region.name,
			checked: selectedRegionNames.has(region.name)
		}));

		return response.render('applications/create/case/_region', {
			errors: validationErrors || apiErrors,
			regions: checkBoxRegions
		});
	}

	response.redirect(`/applications-service/create-new-case/${updatedApplicationId}/zoom-level`);
}

/**
 * View the zoom-level step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateCaseZoomLevel(req, response) {
	const { applicationId } = response.locals;
	const { geographicalInformation } = await getApplicationDraft(applicationId);
	const allZoomLevels = await getAllZoomLevels();
	const values = {
		'geographicalInformation.mapZoomLevelName':
			geographicalInformation?.mapZoomLevel?.name || 'none'
	};

	allZoomLevels.sort((a, b) => ((a.displayOrder || '') < (b.displayOrder || '') ? 1 : -1));

	return response.render('applications/create/case/_zoom-level', {
		zoomLevels: allZoomLevels,
		values
	});
}

/**
 * Save the zoom-level for the draft application
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, ApplicationsCreateCaseZoomLevelBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseZoomLevel({ body }, response) {
	const { applicationId } = response.locals;
	const allZoomLevels = await getAllZoomLevels();
	const payload = bodyToPayload(body);
	const values = {
		'geographicalInformation.mapZoomLevelName': body['geographicalInformation.mapZoomLevelName']
	};
	const { errors, id: updatedApplicationId } = await updateApplicationDraft(applicationId, payload);

	if (errors || !updatedApplicationId) {
		return response.render('applications/create/case/_zoom-level', {
			errors,
			zoomLevels: allZoomLevels,
			values
		});
	}

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
	const { caseEmail } = await getApplicationDraft(applicationId);
	const values = { caseEmail };

	return response.render('applications/create/case/_team-email', { values });
}

/**
 * View the case-team email address step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, ApplicationsCreateCaseTeamEmailBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateCaseTeamEmail(
	{ body, errors: validationErrors },
	response
) {
	const { applicationId } = response.locals;
	const values = { caseEmail: body.caseEmail };
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedApplicationId } = await updateApplicationDraft(
		applicationId,
		payload
	);

	if (validationErrors || apiErrors || !updatedApplicationId) {
		return response.render('applications/create/case/_team-email', {
			errors: validationErrors || apiErrors,
			values
		});
	}

	response.redirect(
		`/applications-service/create-new-case/${applicationId}/applicant-information-types`
	);
}
