import pino from '../../../../lib/logger.js';
import { handleErrors } from '../../../common/components/error-handler/error-handler.component.js';
import {
	caseGeographicalInformationData,
	caseGeographicalInformationDataUpdate,
	caseNameAndDescriptionData,
	caseNameAndDescriptionDataUpdate,
	caseRegionsData,
	caseRegionsDataUpdate,
	caseSectorData,
	caseSectorDataUpdate,
	caseSubSectorData,
	caseSubSectorDataUpdate,
	caseTeamEmailData,
	caseTeamEmailDataUpdate,
	caseZoomLevelData,
	caseZoomLevelDataUpdate
} from '../../../common/components/form/form-case.component.js';
import {
	destroySessionCaseSectorName,
	getSessionCaseHasNeverBeenResumed,
	setSessionCaseSectorName
} from '../../../common/services/session.service.js';

/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseNameProps} ApplicationsCreateCaseNameProps */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseNameBody} ApplicationsCreateCaseNameBody */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseSectorProps} ApplicationsCreateCaseSectorProps */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseSectorBody} ApplicationsCreateCaseSectorBody */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseSubSectorProps} ApplicationsCreateCaseSubSectorProps */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseSubSectorBody} ApplicationsCreateCaseSubSectorBody */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseGeographicalInformationProps} ApplicationsCreateCaseGeographicalInformationProps */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseGeographicalInformationBody} ApplicationsCreateCaseGeographicalInformationBody */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseRegionsProps} ApplicationsCreateCaseRegionsProps */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseRegionsBody} ApplicationsCreateCaseRegionsBody */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseZoomLevelProps} ApplicationsCreateCaseZoomLevelProps */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseZoomLevelBody} ApplicationsCreateCaseZoomLevelBody */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseTeamEmailProps} ApplicationsCreateCaseTeamEmailProps */
/** @typedef {import('./applications-create-case.types.js').ApplicationsCreateCaseTeamEmailBody} ApplicationsCreateCaseTeamEmailBody */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

const nameLayout = {
	pageTitle: 'Enter name and description',
	components: ['title', 'description'],
	backLink: 'dashboard'
};
const sectorLayout = { pageTitle: 'Choose a sector', components: ['sector'], backLink: '' };
const subSectorLayout = {
	pageTitle: 'Choose a subsector',
	components: ['sub-sector'],
	backLink: 'sector'
};
const geographicalInformationLayout = {
	pageTitle: 'Enter geographical information',
	components: ['project-location', 'grid-references'],
	backLink: 'sub-sector'
};
const regionsLayout = {
	pageTitle: 'Choose one or multiple regions',
	components: ['regions'],
	backLink: 'geographical-information'
};
const zoomLevelLayout = {
	pageTitle: 'Choose map zoom level',
	components: ['zoom-level'],
	backLink: 'regions'
};
const teamEmailLayout = {
	pageTitle: 'Enter the project email',
	components: ['team-email'],
	backLink: 'zoom-level'
};

/**
 * View the first step (name & description) of the casecreation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseName(req, response) {
	const properties = await caseNameAndDescriptionData(req, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: nameLayout
	});
}

/**
 * Create the case with name and description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps,
 * {}, ApplicationsCreateCaseNameBody, {}, {}>}
 */
export async function updateApplicationsCreateCaseName(request, response) {
	const { properties, updatedCaseId } = await caseNameAndDescriptionDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, nameLayout, response);
	}

	response.redirect(`/applications-service/create-new-case/${updatedCaseId}/sector`);
}

/**
 * View the sector choice step of the casecreation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSectorProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseSector(request, response) {
	const properties = await caseSectorData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: sectorLayout
	});
}

/**
 * Save the sector for the draft case
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSectorProps,
 * {}, ApplicationsCreateCaseSectorBody, {}, {}>}
 */
export async function updateApplicationsCreateCaseSector(request, response) {
	const { caseId } = response.locals;
	const properties = await caseSectorDataUpdate(request);

	if (properties.errors) {
		return handleErrors(properties, sectorLayout, response);
	}

	setSessionCaseSectorName(request.session, properties.values.sectorName);
	response.redirect(`/applications-service/create-new-case/${caseId}/sub-sector`);
}

/**
 * View the sub-sector choice step of the casecreation
 *
 * @type {import('@pins/express').RenderHandler<*, *>}
 */
export async function viewApplicationsCreateCaseSubSector(request, response) {
	const { caseId } = response.locals;
	const { properties, redirectToSector } = await caseSubSectorData(request, response.locals);

	if (redirectToSector) {
		pino.warn('Trying to change subsector with no sector value registered. Redirect to sector');
		return response.redirect(`/applications-service/create-new-case/${caseId}/sector`);
	}

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: subSectorLayout
	});
}

/**
 * Save the sub-sector for the draft case
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseSubSectorProps,
 * {}, ApplicationsCreateCaseSubSectorBody, {}, {}>}
 */
export async function updateApplicationsCreateCaseSubSector(request, response) {
	const { properties, updatedCaseId } = await caseSubSectorDataUpdate(request, response.locals);

	if (properties?.errors || !updatedCaseId) {
		return handleErrors(properties, subSectorLayout, response);
	}

	destroySessionCaseSectorName(request.session);
	response.redirect(
		`/applications-service/create-new-case/${updatedCaseId}/geographical-information`
	);
}

/**
 * View the geographical information step of the casecreation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseGeographicalInformation(request, response) {
	const properties = await caseGeographicalInformationData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: geographicalInformationLayout
	});
}

/**
 * Save the geographical location for the draft case
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps,
 * {}, ApplicationsCreateCaseGeographicalInformationBody, {}, {}>}
 */
export async function updateApplicationsCreateCaseGeographicalInformation(request, response) {
	const { properties, updatedCaseId } = await caseGeographicalInformationDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, geographicalInformationLayout, response);
	}

	response.redirect(`/applications-service/create-new-case/${updatedCaseId}/regions`);
}

/**
 * View the regions step of the casecreation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseRegionsProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseRegions(request, response) {
	const properties = await caseRegionsData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: regionsLayout
	});
}

/**
 * Save the regions for the draft case
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseRegionsProps,
 * {}, ApplicationsCreateCaseRegionsBody, {}, {}>}
 */
export async function updateApplicationsCreateCaseRegions(request, response) {
	const { properties, updatedCaseId } = await caseRegionsDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, regionsLayout, response);
	}

	return response.redirect(`/applications-service/create-new-case/${updatedCaseId}/zoom-level`);
}

/**
 * View the zoom-level step of the casecreation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseZoomLevel(request, response) {
	const properties = await caseZoomLevelData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: zoomLevelLayout
	});
}

/**
 * Save the zoom-level for the draft case
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, ApplicationsCreateCaseZoomLevelBody, {}, {}>}
 */
export async function updateApplicationsCreateCaseZoomLevel(request, response) {
	const { properties, updatedCaseId } = await caseZoomLevelDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, zoomLevelLayout, response);
	}

	response.redirect(`/applications-service/create-new-case/${updatedCaseId}/team-email`);
}

/**
 * View the case-team email address step of the casecreation
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseTeamEmail(request, response) {
	const properties = await caseTeamEmailData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: teamEmailLayout
	});
}

/**
 * Update the case-team email address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, ApplicationsCreateCaseTeamEmailBody, {}, {}>}
 */
export async function updateApplicationsCreateCaseTeamEmail(request, response) {
	const { properties, updatedCaseId } = await caseTeamEmailDataUpdate(request, response.locals);

	if (properties && (properties?.errors || !updatedCaseId)) {
		return handleErrors(properties, teamEmailLayout, response);
	}

	const nextPath = getSessionCaseHasNeverBeenResumed(request.session)
		? 'applicant-information-types'
		: 'applicant-organisation-name';

	response.redirect(`/applications-service/create-new-case/${updatedCaseId}/${nextPath}`);
}
