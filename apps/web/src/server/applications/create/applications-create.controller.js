import * as applicationsCreateService from './applications-create.service.js';

/** @typedef {import('../applications.router').DomainParams} DomainParams */
/** @typedef {import('../applications.types').Sector} Sector */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * @typedef {object} ViewApplicationsCreateSectorProps
 * @property {Sector[]} sectors
 * @property {ValidationErrors=} errors
 */

/**
 * View the first step (name & description) of the application creation
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateName(req, response) {
	response.render('applications/create/_name');
}

/**
 * Create the application with name and description
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function newApplicationsCreateName({ errors }, response) {
	const { id: newApplicationId } = await applicationsCreateService.createApplication();

	if (errors) {
		return response.render('applications/create/_name', { errors });
	}
	response.redirect(`create-new-case/${newApplicationId}/sector`);
}

/**
 * View the sector choice step of the application creation
 *
 * @type {import('@pins/express').RenderHandler<ViewApplicationsCreateSectorProps,
 * {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateSector(req, response) {
	const sectors = await applicationsCreateService.getAllSectors();

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

	const { id: newApplicationId } = await applicationsCreateService.createApplication();

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
