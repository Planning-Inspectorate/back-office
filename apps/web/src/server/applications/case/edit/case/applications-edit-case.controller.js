import { handleErrors } from '../../../common/components/error-handler/error-handler.component.js';
import {
	caseGeographicalInformationData,
	caseGeographicalInformationDataUpdate,
	caseNameAndDescriptionData,
	caseNameAndDescriptionDataUpdate,
	caseStageData,
	caseRegionsData,
	caseRegionsDataUpdate,
	caseTeamEmailData,
	caseTeamEmailDataUpdate,
	caseZoomLevelData,
	caseZoomLevelDataUpdate
} from '../../../common/components/form/form-case.component.js';

const nameLayout = {
	pageTitle: 'Enter project name',
	components: ['title'],
	isEdit: true
};

const descriptionLayout = {
	pageTitle: 'Enter project description',
	components: ['description'],
	isEdit: true
};

const stageLayout = {
	pageTitle: 'Select a case stage',
	components: ['stage'],
	isEdit: true
};

const teamEmailLayout = {
	pageTitle: 'Enter the project email (optional)',
	components: ['team-email'],
	isEdit: true
};

const caseLocationLayout = {
	pageTitle: 'Enter project location',
	components: ['project-location'],
	isEdit: true
};

const gridReferencesLayout = {
	pageTitle: 'Enter grid references',
	components: ['grid-references'],
	isEdit: true
};

const regionsLayout = {
	pageTitle: 'Choose one or multiple regions',
	components: ['regions'],
	isEdit: true
};

const zoomLevelLayout = {
	pageTitle: 'Choose map zoom level',
	components: ['zoom-level'],
	isEdit: true
};

/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseNameProps} ApplicationsCreateCaseNameProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseNameBody} ApplicationsCreateCaseNameBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseSectorProps} ApplicationsCreateCaseSectorProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseSectorBody} ApplicationsCreateCaseSectorBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseStageProps} ApplicationsCreateCaseStageProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseStageBody} ApplicationsCreateCaseStageBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseSubSectorProps} ApplicationsCreateCaseSubSectorProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseSubSectorBody} ApplicationsCreateCaseSubSectorBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseGeographicalInformationProps} ApplicationsCreateCaseGeographicalInformationProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseGeographicalInformationBody} ApplicationsCreateCaseGeographicalInformationBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseRegionsProps} ApplicationsCreateCaseRegionsProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseRegionsBody} ApplicationsCreateCaseRegionsBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseZoomLevelProps} ApplicationsCreateCaseZoomLevelProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseZoomLevelBody} ApplicationsCreateCaseZoomLevelBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseTeamEmailProps} ApplicationsCreateCaseTeamEmailProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseTeamEmailBody} ApplicationsCreateCaseTeamEmailBody */

/**
 * View the form step for editing the case description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseDescription(request, response) {
	const properties = await caseNameAndDescriptionData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: descriptionLayout
	});
}

/**
 * View the form step for editing the casename
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseName(request, response) {
	const properties = await caseNameAndDescriptionData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: nameLayout
	});
}

/**
 * Edit the casedescription
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, ApplicationsCreateCaseNameBody, {}, {}>}
 */
export async function updateApplicationsEditCaseNameAndDescription(request, response) {
	const { properties, updatedCaseId } = await caseNameAndDescriptionDataUpdate(
		request,
		response.locals
	);
	const isNamePage = Object.prototype.hasOwnProperty.call(request.body, 'title');
	const layout = isNamePage ? nameLayout : descriptionLayout;

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, layout, response);
	}

	response.redirect(`/applications-service/case/${updatedCaseId}/project-information`);
}

/**
 * View the form step for editing the team email
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseTeamEmail(request, response) {
	const properties = await caseTeamEmailData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: teamEmailLayout
	});
}

/**
 * Edit the case-team email address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, ApplicationsCreateCaseTeamEmailBody, {}, {}>}
 */
export async function updateApplicationsEditCaseTeamEmail(request, response) {
	const { properties, updatedCaseId } = await caseTeamEmailDataUpdate(request, response.locals);

	if (properties && (properties?.errors || !updatedCaseId)) {
		return handleErrors(properties, teamEmailLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedCaseId}/project-information`);
}

/**
 * View the form step for editing the case stage
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseStageProps,
 * {}, ApplicationsCreateCaseStageBody, {}, {}>}
 * */
export async function viewApplicationsEditCaseStage(request, response) {
	const properties = await caseStageData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: stageLayout
	});
}

/**
 * View the form step for editing the case location
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseLocation(request, response) {
	const properties = await caseGeographicalInformationData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: caseLocationLayout
	});
}

/**
 * View the form step for editing the grid references
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateCaseGridReferences(request, response) {
	const properties = await caseGeographicalInformationData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: gridReferencesLayout
	});
}

/**
 * Edit the project location
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps,
 * {}, ApplicationsCreateCaseGeographicalInformationBody, {}, {}>}
 */
export async function updateApplicationsEditCaseGeographicalInformation(request, response) {
	const { properties, updatedCaseId } = await caseGeographicalInformationDataUpdate(
		request,
		response.locals
	);

	const isCaseLocationPage = Object.prototype.hasOwnProperty.call(
		request.body,
		'geographicalInformation.locationDescription'
	);
	const layout = isCaseLocationPage ? caseLocationLayout : gridReferencesLayout;

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, layout, response);
	}

	response.redirect(`/applications-service/case/${updatedCaseId}/project-information`);
}

/**
 * View the form step for editing the regions
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseRegionsProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseRegions(request, response) {
	const properties = await caseRegionsData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: regionsLayout
	});
}

/**
 * Edit the regions
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseRegionsProps,
 * {}, ApplicationsCreateCaseRegionsBody, {}, {}>}
 */
export async function updateApplicationsEditCaseRegions(request, response) {
	const { properties, updatedCaseId } = await caseRegionsDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, regionsLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedCaseId}/project-information`);
}

/**
 * View the form step for editing the zoom level
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseZoomLevel(request, response) {
	const properties = await caseZoomLevelData(request, response.locals);

	return response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: zoomLevelLayout
	});
}

/**
 * Edit the zoom level
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseZoomLevelProps,
 * {}, ApplicationsCreateCaseZoomLevelBody, {}, {}>}
 */
export async function updateApplicationsEditCaseZoomLevel(request, response) {
	const { properties, updatedCaseId } = await caseZoomLevelDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, zoomLevelLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedCaseId}/project-information`);
}
