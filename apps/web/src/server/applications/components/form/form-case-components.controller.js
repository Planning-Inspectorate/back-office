import { bodyToPayload } from '../../../lib/body-formatter.js';
import {
	createApplicationDraft,
	getApplicationDraft,
	updateApplicationDraft
} from '../../create/applications-create.service.js';
import {
	getAllRegions,
	getAllSectors,
	getAllZoomLevels,
	getSubSectorsBySectorName
} from '../../create/case/applications-create-case.service.js';
import { getSessionCaseSectorName } from '../../create/case/applications-create-case-session.service.js';

/** @typedef {import('../../create/case/applications-create-case.types').ApplicationsCreateCaseNameProps} ApplicationsCreateCaseNameProps */
/** @typedef {import('../../create/case/applications-create-case.types').ApplicationsCreateCaseSectorProps} ApplicationsCreateCaseSectorProps */
/** @typedef {import('../../create/case/applications-create-case.types').ApplicationsCreateCaseZoomLevelProps} ApplicationsCreateCaseZoomLevelProps */
/** @typedef {import('../../create/case/applications-create-case.types').ApplicationsCreateCaseSubSectorProps} ApplicationsCreateCaseSubSectorProps */
/** @typedef {import('../../create/case/applications-create-case.types').ApplicationsCreateCaseRegionsProps} ApplicationsCreateCaseRegionsProps */
/** @typedef {import('../../create/case/applications-create-case.types').ApplicationsCreateCaseTeamEmailProps} ApplicationsCreateCaseTeamEmailProps */
/** @typedef {import('../../create/case/applications-create-case.types').ApplicationsCreateCaseGeographicalInformationProps} ApplicationsCreateCaseGeographicalInformationProps */

/**
 * Format properties for name and description page
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseNameProps>}
 */
export async function formatViewCaseNameAndDescription(request, locals) {
	const { applicationId } = locals || {};
	const { title, description } = applicationId
		? await getApplicationDraft(applicationId, ['title', 'description'])
		: { title: '', description: '' };

	return { values: { title, description } };
}

/**
 * Format properties for name and description update page
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseNameProps, updatedApplicationId?: number| null}>}
 */
export async function formatUpdateCaseNameAndDescription(
	{ errors: validationErrors, session, body },
	locals
) {
	const { applicationId } = locals;
	const { description, title } = body;
	const payload = bodyToPayload(body);
	const action = applicationId
		? () => updateApplicationDraft(applicationId, payload)
		: () => createApplicationDraft(payload, session);

	const { errors: apiErrors, id: updatedApplicationId } = validationErrors
		? { id: null, errors: validationErrors }
		: await action();

	const properties = { values: { description, title }, errors: validationErrors || apiErrors };

	return { properties, updatedApplicationId };
}

/**
 * Format properties for sector page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseSectorProps>}
 */
export async function formatViewCaseSector({ session }, locals) {
	const { applicationId } = locals;
	const allSectors = await getAllSectors();

	const { sector } = await getApplicationDraft(applicationId, ['sector']);
	const selectedSectorName = getSessionCaseSectorName(session) || sector?.name;

	const values = { sectorName: selectedSectorName || '' };

	return { values, sectors: allSectors };
}

/**
 * Format properties for sector update page
 *
 *
 * @param {import('express').Request} request
 * @returns {Promise<ApplicationsCreateCaseSectorProps>}
 */
export async function formatUpdateCaseSector({ errors, body }) {
	const { sectorName } = body;

	/** @type {ApplicationsCreateCaseSectorProps} * */
	let properties = { errors, values: { sectorName }, sectors: [] };

	if (errors) {
		const allSectors = await getAllSectors();

		properties = { ...properties, sectors: allSectors || [] };
	}

	return properties;
}

/**
 * Format properties for geo info  page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseGeographicalInformationProps>}
 */
export async function formatViewCaseGeographicalInformation(request, locals) {
	const { applicationId } = locals;
	const { geographicalInformation } = await getApplicationDraft(applicationId, [
		'geographicalInformation'
	]);
	const { locationDescription, gridReference } = geographicalInformation || {};

	const values = {
		'geographicalInformation.locationDescription': locationDescription,
		'geographicalInformation.gridReference.easting': gridReference?.easting,
		'geographicalInformation.gridReference.northing': gridReference?.northing
	};

	return { values };
}

/**
 * Format properties for geo info update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseGeographicalInformationProps, updatedApplicationId?: number}>}
 */
export async function formatUpdateCaseGeographicalInformation(
	{ errors: validationErrors, body },
	locals
) {
	const { applicationId } = locals;
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
	const properties = { errors: validationErrors || apiErrors, values };

	return { properties, updatedApplicationId };
}

/**
 * Format properties for sub-sector  page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties?: ApplicationsCreateCaseSubSectorProps, redirectToSector: boolean}>}
 */
export async function formatViewCaseSubSector({ session }, locals) {
	const { applicationId } = locals;
	const { sector, subSector } = await getApplicationDraft(applicationId, ['subSector', 'sector']);
	const selectedSectorName = getSessionCaseSectorName(session) || sector?.name;

	if (!selectedSectorName) {
		return { redirectToSector: true };
	}

	const subSectors = await getSubSectorsBySectorName(selectedSectorName);

	const properties = {
		subSectors: subSectors || [],
		values: { subSectorName: subSector?.name }
	};

	return { properties, redirectToSector: false };
}

/**
 * Format properties for subsector update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseSubSectorProps, updatedApplicationId?: number}>}
 */
export async function formatUpdateCaseSubSector(
	{ session, errors: validationErrors, body },
	locals
) {
	const { applicationId } = locals;
	const { subSectorName } = body;
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedApplicationId } = await updateApplicationDraft(
		applicationId,
		payload
	);

	/** @type {ApplicationsCreateCaseSubSectorProps} * */
	let properties = {
		values: { subSectorName },
		errors: validationErrors || apiErrors,
		subSectors: []
	};

	if (validationErrors || apiErrors || !updatedApplicationId) {
		const { sector } = await getApplicationDraft(applicationId, ['sector']);
		const selectedSectorName = getSessionCaseSectorName(session) || sector?.name;
		const subSectors = await getSubSectorsBySectorName(selectedSectorName);

		properties = { ...properties, subSectors };
	}

	return { properties, updatedApplicationId };
}

/**
 * Format properties for regions  page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseRegionsProps>}
 */
export async function formatViewCaseRegions(request, locals) {
	const { applicationId } = locals;
	const allRegions = await getAllRegions();
	const { geographicalInformation } = await getApplicationDraft(applicationId, [
		'geographicalInformation'
	]);
	const selectedRegionNames = new Set(
		(geographicalInformation?.regions || []).map((region) => region?.name)
	);

	const checkBoxRegions = allRegions.map((region) => ({
		text: region.displayNameEn,
		value: region.name,
		checked: selectedRegionNames.has(region.name)
	}));

	return { allRegions: checkBoxRegions };
}

/**
 * Format properties for regions update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseRegionsProps, updatedApplicationId?: number}>}
 */
export async function formatUpdateCaseRegions({ errors: validationErrors, body }, locals) {
	const { applicationId } = locals;
	const selectedRegionNames = new Set(body['geographicalInformation.regionNames'] || []);
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedApplicationId } = await updateApplicationDraft(
		applicationId,
		payload
	);

	/** @type {ApplicationsCreateCaseRegionsProps} */
	let properties = { errors: validationErrors || apiErrors, allRegions: [] };

	if (validationErrors || apiErrors || !updatedApplicationId) {
		const allRegions = await getAllRegions();
		const checkBoxRegions = allRegions.map((region) => ({
			text: region.displayNameEn,
			value: region.name,
			checked: selectedRegionNames.has(region.name)
		}));

		properties = { ...properties, allRegions: checkBoxRegions };
	}

	return { properties, updatedApplicationId };
}

/**
 * Format properties for zoomlevel page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseZoomLevelProps>}
 */
export async function formatViewCaseZoomLevel(request, locals) {
	const { applicationId } = locals;
	const { geographicalInformation } = await getApplicationDraft(applicationId, [
		'geographicalInformation'
	]);
	const allZoomLevels = await getAllZoomLevels();
	const values = {
		'geographicalInformation.mapZoomLevelName':
			geographicalInformation?.mapZoomLevel?.name || 'none'
	};

	allZoomLevels.sort((a, b) => ((a.displayOrder || '') < (b.displayOrder || '') ? 1 : -1));

	return {
		zoomLevels: allZoomLevels,
		values
	};
}

/**
 * Format properties for zoom level update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseZoomLevelProps, updatedApplicationId?: number}>}
 */
export async function formatUpdateCaseZoomLevel({ body }, locals) {
	const { applicationId } = locals;
	const allZoomLevels = await getAllZoomLevels();
	const payload = bodyToPayload(body);
	const values = {
		'geographicalInformation.mapZoomLevelName': body['geographicalInformation.mapZoomLevelName']
	};
	const { errors, id: updatedApplicationId } = await updateApplicationDraft(applicationId, payload);

	/** @type {ApplicationsCreateCaseZoomLevelProps} */
	let properties = { errors, values, zoomLevels: [] };

	if (errors || !updatedApplicationId) {
		properties = { ...properties, zoomLevels: allZoomLevels };
	}

	return { properties, updatedApplicationId };
}

/**
 * Format properties for team email page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseTeamEmailProps>}
 */
export async function formatViewCaseTeamEmail(request, locals) {
	const { applicationId } = locals;
	const { caseEmail } = await getApplicationDraft(applicationId, ['caseEmail']);

	return { values: { caseEmail } };
}

/**
 * Format properties for team email update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties?: ApplicationsCreateCaseTeamEmailProps, updatedApplicationId?: number}>}
 */
export async function formatUpdateCaseTeamEmail({ body, errors: validationErrors }, locals) {
	const { applicationId } = locals;
	/** @type {{properties?: ApplicationsCreateCaseTeamEmailProps, updatedApplicationId?: number}} */
	const propertiesWithId = { updatedApplicationId: applicationId };

	if (body.caseEmail) {
		const values = { caseEmail: body.caseEmail };
		const payload = bodyToPayload(body);

		const { errors: apiErrors, id: updatedApplicationId } = await updateApplicationDraft(
			applicationId,
			payload
		);

		if (validationErrors || apiErrors || !updatedApplicationId) {
			propertiesWithId.properties = { values, errors: validationErrors || apiErrors };
		}
	}
	return propertiesWithId;
}
