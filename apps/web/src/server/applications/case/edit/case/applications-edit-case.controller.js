import { handleErrors } from '../../../common/components/error-handler/error-handler.component.js';
import { setSessionBanner } from '../../../common/services/session.service.js';
import { featureFlagClient } from '../../../../../common/feature-flags.js';
import {
	caseGeographicalInformationData,
	caseGeographicalInformationDataUpdate,
	caseNameAndDescriptionData,
	caseNameAndDescriptionDataUpdate,
	caseStageData,
	caseStageDataUpdate,
	caseRegionsData,
	caseRegionsDataUpdate,
	caseTeamEmailData,
	caseTeamEmailDataUpdate,
	caseZoomLevelData,
	caseZoomLevelDataUpdate,
	isMaterialChangeDataUpdate
} from '../../../common/components/form/form-case.component.js';
import { getUpdatedField } from '../applications-edit.service.js';
import { getIsMaterialChangeStaticDataViewModel } from '../../../../lib/static-data-view-models.js';

const nameLayout = {
	pageTitle: 'Project name',
	components: ['title'],
	isEdit: true
};

const welshNameLayout = {
	pageTitle: 'Project name in Welsh',
	components: ['titleWelsh'],
	isEdit: true
};

const descriptionLayout = {
	pageTitle: 'Enter project description',
	components: ['description'],
	label: 'Project description',
	name: 'description',
	hint: 'for example, An offshore wind generating station of capacity up to 285 MW',
	template: 'case-edit-textarea.njk',
	isEdit: true
};

const welshDescriptionLayout = {
	pageTitle: 'Project description in Welsh',
	components: ['descriptionWelsh'],
	label: 'Project description in Welsh',
	englishLabel: 'Project description in English',
	name: 'descriptionWelsh',
	englishName: 'description',
	template: 'case-edit-textarea.njk',
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
	label: 'Project location',
	name: 'geographicalInformation.locationDescription',
	hint: 'for example, approximately 8km off the coast of Kent, in areas surrounding Thanet Offshore Wind Farm',
	template: 'case-edit-textarea.njk',
	isEdit: true
};

const caseLocationWelshLayout = {
	pageTitle: 'Project location in Welsh',
	components: ['project-location-welsh'],
	label: 'Project location in Welsh',
	englishLabel: 'Project location in English',
	name: 'geographicalInformation.locationDescriptionWelsh',
	englishName: 'geographicalInformation.locationDescription',
	template: 'case-edit-textarea.njk',
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

const isMaterialChangeLayout = {
	pageTitle: 'Is this an application for a material change?',
	components: ['material-change'],
	isEdit: true
};

/** @type {Record<string, string>} */
const fullFieldNames = {
	title: 'Project name',
	titleWelsh: 'Project name in Welsh',
	description: 'Project description',
	descriptionWelsh: 'Project description in Welsh',
	caseEmail: 'Project email address',
	stage: 'Case stage',
	'geographicalInformation.locationDescription': 'Project location',
	'geographicalInformation.locationDescriptionWelsh': 'Project location in Welsh',
	'geographicalInformation.gridReference.easting': 'Grid references',
	'geographicalInformation.gridReference.northing': 'Grid references',
	'geographicalInformation.regions': 'Regions',
	'geographicalInformation.mapZoomLevelName': 'Map zoom level',
	isMaterialChange: 'Material change'
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
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseIsMaterialChangeBody} ApplicationsCreateCaseIsMaterialChangeBody */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseIsMaterialChangeProps} ApplicationsCreateCaseIsMaterialChangeProps */
/** @typedef {import('../../../create-new-case/case/applications-create-case.types.js').ApplicationsCreateCaseIsMaterialChangeRes} ApplicationsCreateCaseIsMaterialChangeRes */

/**
 * View the form step for editing the case description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseDescription(request, response) {
	const properties = caseNameAndDescriptionData(request, response.locals);

	response.render(resolveTemplate(descriptionLayout), {
		...properties,
		layout: descriptionLayout
	});
}

/**
 * Resolves the expected template to render
 *
 * @param {import('../../../applications.types.js').FormCaseLayout} layout
 * @returns {string}
 */
function resolveTemplate(layout) {
	const { template } = layout || {};
	if (template) {
		return `applications/case/case-form/${template}`;
	}
	return `applications/components/case-form/case-form-layout`;
}

/**
 * View the form step for editing the Welsh case description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 * */
export async function viewApplicationsEditCaseDescriptionWelsh(request, response) {
	if (!featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
		return response.redirect(
			`/applications-service/case/${response.locals.caseId}/project-information`
		);
	}

	const properties = caseNameAndDescriptionData(request, response.locals);

	response.render(resolveTemplate(welshDescriptionLayout), {
		...properties,
		layout: welshDescriptionLayout
	});
}

/**
 * View the form step for editing the casename
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseName(request, response) {
	const properties = caseNameAndDescriptionData(request, response.locals);

	response.render(resolveTemplate(nameLayout), {
		...properties,
		layout: nameLayout
	});
}

/**
 * View the form step for editing the Welsh case name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseNameProps, {}, {}, {}, {}>}
 * */
export async function viewApplicationsEditCaseNameWelsh(request, response) {
	if (!featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
		return response.redirect(
			`/applications-service/case/${response.locals.caseId}/project-information`
		);
	}

	const properties = caseNameAndDescriptionData(request, response.locals);

	response.render(resolveTemplate(welshNameLayout), {
		...properties,
		layout: welshNameLayout
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

	const updatedField = getUpdatedField(request.body, [
		'title',
		'titleWelsh',
		'description',
		'descriptionWelsh'
	]);

	let layout;

	switch (updatedField) {
		case 'title':
			layout = nameLayout;
			break;
		case 'titleWelsh': {
			layout = welshNameLayout;
			// Include english equivalent if entered
			const { title } = response.locals.currentCase || {};
			if (title) {
				properties.values.title = title;
			}
			break;
		}
		case 'description':
			layout = descriptionLayout;
			break;
		default: {
			layout = welshDescriptionLayout;
			// Include english equivalent if entered
			const { description } = response.locals.currentCase || {};
			if (description) {
				properties.values.description = description;
			}
			break;
		}
	}

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, layout, response);
	}

	setSessionBanner(request.session, `${fullFieldNames[updatedField]} updated.`);

	response.redirect(
		featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? `/applications-service/case/${updatedCaseId}`
			: `/applications-service/case/${updatedCaseId}/project-information`
	);
}

/**
 * View the form step for editing the team email
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseTeamEmailProps,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsEditCaseTeamEmail(request, response) {
	const properties = caseTeamEmailData(request, response.locals);

	return response.render(resolveTemplate(teamEmailLayout), {
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

	setSessionBanner(request.session, `${fullFieldNames.caseEmail} updated.`);

	response.redirect(
		featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? `/applications-service/case/${updatedCaseId}`
			: `/applications-service/case/${updatedCaseId}/project-information`
	);
}

/**
 * View the form step for editing the case stage
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseStageProps,
 * {}, ApplicationsCreateCaseStageBody, {}, {}>}
 * */
export async function viewApplicationsEditCaseStage(request, response) {
	const properties = await caseStageData(request, response.locals);

	return response.render(resolveTemplate(stageLayout), {
		...properties,
		layout: stageLayout
	});
}

/**
 * Edit the case stage
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseStageProps,
 * {}, ApplicationsCreateCaseStageBody, {}, {}>}
 */
export async function updateApplicationsEditCaseStage(request, response) {
	const { properties, updatedCaseId } = await caseStageDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, stageLayout, response);
	}

	setSessionBanner(request.session, `${fullFieldNames.stage} updated.`);

	return response.redirect(
		featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? `/applications-service/case/${updatedCaseId}`
			: `/applications-service/case/${updatedCaseId}/project-information`
	);
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

	response.render(resolveTemplate(caseLocationLayout), {
		...properties,
		layout: caseLocationLayout
	});
}

/**
 * View the form step for editing the Welsh case location
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseGeographicalInformationProps, {}, {}, {}, {}>}
 * */
export async function viewApplicationsCreateCaseLocationWelsh(request, response) {
	if (!featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
		return response.redirect(
			`/applications-service/case/${response.locals.caseId}/project-information`
		);
	}

	const properties = await caseGeographicalInformationData(request, response.locals);

	response.render(resolveTemplate(caseLocationWelshLayout), {
		...properties,
		layout: caseLocationWelshLayout
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

	response.render(resolveTemplate(gridReferencesLayout), {
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

	const updatedField = getUpdatedField(request.body, [
		'geographicalInformation.locationDescription',
		'geographicalInformation.locationDescriptionWelsh',
		'geographicalInformation.gridReference.easting',
		'geographicalInformation.gridReference.northing'
	]);

	let layout;

	switch (updatedField) {
		case 'geographicalInformation.locationDescription':
			layout = caseLocationLayout;
			break;
		case 'geographicalInformation.locationDescriptionWelsh': {
			layout = caseLocationWelshLayout;
			// Include english equivalent if entered
			const { locationDescription } = response.locals.currentCase?.geographicalInformation || {};
			if (locationDescription) {
				properties.values['geographicalInformation.locationDescription'] = locationDescription;
			}
			break;
		}
		default:
			layout = gridReferencesLayout;
			break;
	}

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, layout, response);
	}

	setSessionBanner(request.session, `${fullFieldNames[updatedField]} updated.`);

	response.redirect(
		featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? `/applications-service/case/${updatedCaseId}`
			: `/applications-service/case/${updatedCaseId}/project-information`
	);
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

	return response.render(resolveTemplate(regionsLayout), {
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

	setSessionBanner(
		request.session,
		`${fullFieldNames['geographicalInformation.regions']} updated.`
	);

	response.redirect(
		featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? `/applications-service/case/${updatedCaseId}`
			: `/applications-service/case/${updatedCaseId}/project-information`
	);
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

	return response.render(resolveTemplate(zoomLevelLayout), {
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

	setSessionBanner(
		request.session,
		`${fullFieldNames['geographicalInformation.mapZoomLevelName']} updated.`
	);

	response.redirect(
		featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? `/applications-service/case/${updatedCaseId}`
			: `/applications-service/case/${updatedCaseId}/project-information`
	);
}

/**
 * View the form step for editing is material change
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseIsMaterialChangeRes,
 * {}, {}, {}, {}>}
 */
export async function viewApplicationsEditIsMaterialChange(request, response) {
	const {
		currentCase: { isMaterialChange }
	} = response.locals;

	return response.render(resolveTemplate(isMaterialChangeLayout), {
		values: getIsMaterialChangeStaticDataViewModel(isMaterialChange),
		layout: isMaterialChangeLayout
	});
}

/**
 * Edit is material change
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateCaseIsMaterialChangeProps,
 * {}, ApplicationsCreateCaseIsMaterialChangeBody, {}, {}>}
 */
export async function updateApplicationsEditIsMaterialChange(request, response) {
	const { properties, updatedCaseId } = await isMaterialChangeDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId)
		return handleErrors(properties, isMaterialChangeLayout, response);

	setSessionBanner(request.session, 'Application updated');

	return response.redirect(
		featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? `/applications-service/case/${updatedCaseId}`
			: `/applications-service/case/${updatedCaseId}/project-information`
	);
}
