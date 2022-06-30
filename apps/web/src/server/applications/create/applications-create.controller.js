import * as applicationsCreateService from './applications-create.service.js';

/** @typedef {import('../applications.router').DomainParams} DomainParams */
/** @typedef {import('../applications.types').Sector} Sector */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * @typedef {object} ApplicationsCreateNameProps
 * @property {string=} applicationName
 * @property {string=} applicationDescription
 * @property {ValidationErrors=} errors
 */

/**
 * @typedef {object} ViewApplicationsCreateSectorProps
 * @property {Sector[]} sectors
 * @property {ValidationErrors=} errors
 */

/**
 * @typedef {object} ApplicationsCreateNameBody
 * @property {string=} applicationName
 * @property {string=} applicationDescription
 */

/**
 * View the first step (name & description) of the application creation
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateName({ params }, response) {
	const { applicationId } = params;

	let viewData = { applicationName: '', applicationDescription: '' };

	if (applicationId) {
		const draftApplication = await applicationsCreateService.getApplicationDraft(applicationId);
		const { name: applicationName, description: applicationDescription } = draftApplication;

		viewData = { applicationName, applicationDescription };
	}
	response.render('applications/create/_name', viewData);
}

/**
 * Create the application with name and description
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateNameProps,
 *   {}, ApplicationsCreateNameBody, {}, DomainParams>}
 */
export async function newApplicationsCreateName({ errors, body, params }, response) {
	if (errors) {
		return response.render('applications/create/_name', { errors });
	}

	let { applicationId } = params;

	if (applicationId) {
		const { applicationName, applicationDescription } = body;
		const draftApplication = await applicationsCreateService.getApplicationDraft(applicationId);
		const updatedDraftApplication = {
			...draftApplication,
			name: applicationName,
			description: applicationDescription
		};

		await applicationsCreateService.updateApplicationDraft(updatedDraftApplication);
	} else {
		const { id: newApplicationId } = await applicationsCreateService.updateApplicationDraft({});

		applicationId = newApplicationId;
	}
	response.redirect(`/applications-service/create-new-case/${applicationId}/sector`);
}

/**
 * View the sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ViewApplicationsCreateSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateSector({ params }, response) {
	const { applicationId } = params;

	let sectors = await applicationsCreateService.getAllSectors();

	if (applicationId) {
		const draftApplication = await applicationsCreateService.getApplicationDraft(applicationId);
		const { sector: applicationSector } = draftApplication;

		sectors = sectors.map((s) => ({
			...s,
			checked: applicationSector?.abbreviation === s.abbreviation
		}));
	}

	response.render('applications/create/_sector', { sectors });
}

/**
 * Save the sector for the application being created
 *
 *
 * @type {import('@pins/express').RenderHandler<ViewApplicationsCreateSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function newApplicationsCreateSector({ errors }, response) {
	if (errors) {
		const sectors = await applicationsCreateService.getAllSectors();

		return response.render('applications/create/_sector', { errors, sectors });
	}

	const { id: newApplicationId } = await applicationsCreateService.updateApplicationDraft({});

	response.redirect(`/applications-service/create-new-case/${newApplicationId}/sub-sector`);
}

/**
 * View the sub-sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateSubSector(req, response) {
	response.render('applications/create/_sub-sector');
}
