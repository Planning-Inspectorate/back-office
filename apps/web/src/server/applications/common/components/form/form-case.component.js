import { bodyToPayload } from '../../../../lib/body-formatter.js';
import { createCase, getCase, updateCase } from '../../services/case.service.js';
import {
	getAllCaseStages,
	getAllRegions,
	getAllSectors,
	getAllZoomLevels,
	getSubSectorsBySectorName
} from '../../services/entities.service.js';
import { getSessionCaseSectorName } from '../../services/session.service.js';
import { camelToSnake } from '../../../../lib/camel-to-snake.js';
import { featureFlagClient } from '../../../../../common/feature-flags.js';

/** @typedef {import('../../../applications.types').Region} Region */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseNameProps} ApplicationsCreateCaseNameProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseSectorProps} ApplicationsCreateCaseSectorProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseStageProps} ApplicationsCreateCaseStageProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseZoomLevelProps} ApplicationsCreateCaseZoomLevelProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseSubSectorProps} ApplicationsCreateCaseSubSectorProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseRegionsProps} ApplicationsCreateCaseRegionsProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseTeamEmailProps} ApplicationsCreateCaseTeamEmailProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseGeographicalInformationProps} ApplicationsCreateCaseGeographicalInformationProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types').ApplicationsCreateCaseIsMaterialChangeProps} ApplicationsCreateCaseIsMaterialChangeProps */

/**
 * Format properties for name and description page
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {ApplicationsCreateCaseNameProps}
 */
export function caseNameAndDescriptionData(request, locals) {
	const { currentCase } = locals || {};
	const { title, description, titleWelsh, descriptionWelsh } = currentCase;

	return { values: { title, description, titleWelsh, descriptionWelsh } };
}

/**
 * Format stage property for stage edit page
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseStageProps>}
 * */
export async function caseStageData(request, locals) {
	/** @type {{name: string, displayNameEn: string}[]} */
	const allStages = await (async () => {
		try {
			return (await getAllCaseStages()) ?? [];
		} catch (err) {
			console.error(`error fetching case stages: ${err}`);
			return [];
		}
	})();

	const stages = allStages.filter((stage) => stage.name !== 'draft');

	const { currentCase } = locals || {};
	const { status } = currentCase;

	return { values: { stage: camelToSnake(status) }, stages };
}

/**
 * Perform update for case stage
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseStageProps, updatedCaseId?: number| null}>}
 */
export async function caseStageDataUpdate({ errors: validationErrors, body, session }, locals) {
	const { caseId } = locals;
	const { stage } = body;
	const payload = bodyToPayload(body);
	const action = caseId ? () => updateCase(caseId, payload) : () => createCase(payload, session);

	const { errors: apiErrors, id: updatedCaseId } = validationErrors
		? { id: null, errors: validationErrors }
		: await action();

	const allStages = await (async () => {
		try {
			return (await getAllCaseStages()) ?? [];
		} catch (err) {
			console.error(`error fetching case stages: ${err}`);
			return [];
		}
	})();

	const properties = {
		values: { stage },
		errors: validationErrors || apiErrors,
		stages: allStages
	};

	return { properties, updatedCaseId };
}

/**
 * Format properties for name and description update page
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseNameProps, updatedCaseId?: number| null}>}
 */
export async function caseNameAndDescriptionDataUpdate(
	{ errors: validationErrors, body, session },
	locals
) {
	const { caseId } = locals;
	const { title, titleWelsh, description, descriptionWelsh } = body;
	const payload = bodyToPayload(body);
	const action = caseId ? () => updateCase(caseId, payload) : () => createCase(payload, session);

	const { errors: apiErrors, id: updatedCaseId } = validationErrors
		? { id: null, errors: validationErrors }
		: await action();

	const properties = {
		values: { title, titleWelsh, description, descriptionWelsh },
		errors: validationErrors || apiErrors
	};

	return { properties, updatedCaseId };
}

/**
 * Format properties for sector page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseSectorProps>}
 */
export async function caseSectorData({ session }, locals) {
	const { currentCase } = locals;
	let allSectors = await getAllSectors();

	// If Training Sector Feature is not activated, don't include the Training sector
	if (!featureFlagClient.isFeatureActive('applics-1036-training-sector')) {
		allSectors = allSectors.filter((sector) => sector.name !== 'training');
	}

	const { sector } = currentCase;
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
export async function caseSectorDataUpdate({ errors, body }) {
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
 * @returns {ApplicationsCreateCaseGeographicalInformationProps}
 */
export function caseGeographicalInformationData(request, locals) {
	const { currentCase } = locals;
	const { geographicalInformation } = currentCase;
	const { locationDescription, locationDescriptionWelsh, gridReference } =
		geographicalInformation || {};

	const values = {
		'geographicalInformation.locationDescription': locationDescription,
		'geographicalInformation.locationDescriptionWelsh': locationDescriptionWelsh,
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
 * @returns {Promise<{properties: ApplicationsCreateCaseGeographicalInformationProps, updatedCaseId?: number}>}
 */
export async function caseGeographicalInformationDataUpdate(
	{ errors: validationErrors, body },
	locals
) {
	const { caseId } = locals;
	const payload = bodyToPayload(body);
	const values = {
		'geographicalInformation.locationDescription':
			body['geographicalInformation.locationDescription'],
		'geographicalInformation.locationDescriptionWelsh':
			body['geographicalInformation.locationDescriptionWelsh'],
		'geographicalInformation.gridReference.easting':
			body['geographicalInformation.gridReference.easting'],
		'geographicalInformation.gridReference.northing':
			body['geographicalInformation.gridReference.northing']
	};

	const { errors, id: updatedCaseId } = validationErrors
		? { errors: validationErrors, id: caseId }
		: await updateCase(caseId, payload);
	const properties = { errors, values };

	return { properties, updatedCaseId };
}

/**
 * Format properties for sub-sector  page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties?: ApplicationsCreateCaseSubSectorProps, redirectToSector: boolean}>}
 */
export async function caseSubSectorData({ session }, locals) {
	const { currentCase } = locals;
	const { sector, subSector } = currentCase;
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
 * @returns {Promise<{properties: ApplicationsCreateCaseSubSectorProps, updatedCaseId: number|null}>}
 */
export async function caseSubSectorDataUpdate({ session, errors: validationErrors, body }, locals) {
	const { caseId } = locals;
	const { subSectorName } = body;
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedCaseId = null } = validationErrors
		? { errors: validationErrors }
		: await updateCase(caseId, payload);

	/** @type {ApplicationsCreateCaseSubSectorProps} * */
	let properties = {
		values: { subSectorName },
		errors: validationErrors || apiErrors,
		subSectors: []
	};

	if (validationErrors || apiErrors || !updatedCaseId) {
		const { sector } = await getCase(caseId, ['sector']);
		const selectedSectorName = getSessionCaseSectorName(session) || sector?.name;
		const subSectors = await getSubSectorsBySectorName(selectedSectorName);

		properties = { ...properties, subSectors };
	}

	return { properties, updatedCaseId };
}

/**
 * Format properties for regions  page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseRegionsProps>}
 */
export async function caseRegionsData(request, locals) {
	const { currentCase } = locals;
	const allRegions = await getAllRegions();
	const { geographicalInformation } = currentCase;
	/** @type {Region[]} */
	const regions = geographicalInformation?.regions || [];
	const selectedRegionNames = new Set(regions.map((region) => region?.name));

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
 * @returns {Promise<{properties: ApplicationsCreateCaseRegionsProps, updatedCaseId: number|null}>}
 */
export async function caseRegionsDataUpdate({ errors: validationErrors, body }, locals) {
	const { caseId } = locals;
	const selectedRegionNames = new Set(body['geographicalInformation.regionNames'] || []);
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedCaseId = null } = validationErrors
		? { errors: validationErrors }
		: await updateCase(caseId, payload);

	/** @type {ApplicationsCreateCaseRegionsProps} */
	let properties = { errors: validationErrors || apiErrors, allRegions: [] };

	if (validationErrors || apiErrors || !updatedCaseId) {
		const allRegions = await getAllRegions();
		const checkBoxRegions = allRegions.map((region) => ({
			text: region.displayNameEn,
			value: region.name,
			checked: selectedRegionNames.has(region.name)
		}));

		properties = { ...properties, allRegions: checkBoxRegions };
	}

	return { properties, updatedCaseId };
}

/**
 * Format properties for zoomlevel page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateCaseZoomLevelProps>}
 */
export async function caseZoomLevelData(request, locals) {
	const { currentCase } = locals;
	const { geographicalInformation } = currentCase;
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
 * @returns {Promise<{properties: ApplicationsCreateCaseZoomLevelProps, updatedCaseId?: number}>}
 */
export async function caseZoomLevelDataUpdate({ body }, locals) {
	const { caseId } = locals;
	const allZoomLevels = await getAllZoomLevels();
	const payload = bodyToPayload(body);
	const values = {
		'geographicalInformation.mapZoomLevelName': body['geographicalInformation.mapZoomLevelName']
	};
	const { errors, id: updatedCaseId } = await updateCase(caseId, payload);

	/** @type {ApplicationsCreateCaseZoomLevelProps} */
	let properties = { errors, values, zoomLevels: [] };

	if (errors || !updatedCaseId) {
		properties = { ...properties, zoomLevels: allZoomLevels };
	}

	return { properties, updatedCaseId };
}

/**
 * Format properties for is material change update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateCaseIsMaterialChangeProps, updatedCaseId?: number}>}
 */
export async function isMaterialChangeDataUpdate({ body }, locals) {
	body['isMaterialChange'] = body['isMaterialChange'] === 'true';

	const values = {
		isMaterialChange: body['isMaterialChange']
	};

	const { errors, id: updatedCaseId } = await updateCase(locals.caseId, body);

	const properties = { errors, values };

	return { properties, updatedCaseId };
}

/**
 * Format properties for team email page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {ApplicationsCreateCaseTeamEmailProps}
 */
export function caseTeamEmailData(request, locals) {
	const { currentCase } = locals;
	const { caseEmail } = currentCase;

	return { values: { caseEmail } };
}

/**
 * Format properties for team email update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties?: ApplicationsCreateCaseTeamEmailProps, updatedCaseId?: number}>}
 */
export async function caseTeamEmailDataUpdate({ body, errors: validationErrors }, locals) {
	const { caseId } = locals;
	/** @type {{properties?: ApplicationsCreateCaseTeamEmailProps, updatedCaseId?: number}} */
	const propertiesWithId = { updatedCaseId: caseId };
	const values = { caseEmail: body.caseEmail };
	const payload = bodyToPayload(body);

	const { errors: apiErrors, id: updatedCaseId = null } = validationErrors
		? { errors: validationErrors }
		: await updateCase(caseId, payload);

	if (validationErrors || apiErrors || !updatedCaseId) {
		propertiesWithId.properties = { values, errors: validationErrors || apiErrors };
	}
	return propertiesWithId;
}
