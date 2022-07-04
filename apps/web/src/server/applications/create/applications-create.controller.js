import * as applicationsCreateService from './applications-create.service.js';

/** @typedef {import('../applications.router').DomainParams} DomainParams */
/** @typedef {import('../applications.types').Sector} Sector */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 *  @callback updateOrCreateCallback
 *  @returns {Promise<{errors?: object, id?: string}>}
 */

/**
 * @typedef {object} ApplicationsCreateNameProps
 * @property {string=} applicationName
 * @property {string=} applicationDescription
 * @property {ValidationErrors=} errors
 */

/**
 * @typedef {object} ApplicationsCreateNameBody
 * @property {string=} applicationName
 * @property {string=} applicationDescription
 */

/**
 * @typedef {object} ApplicationsCreateSectorProps
 * @property {Sector[]} sectors
 * @property {string=} selectedValue
 * @property {ValidationErrors=} errors
 */

/**
 * @typedef {object} ApplicationsCreateSectorBody
 * @property {string} selectedSectorName
 */

/**
 * @typedef {object} ApplicationsCreateSubSectorProps
 * @property {Sector[]} subSectors
 * @property {string=} selectedValue
 * @property {ValidationErrors=} errors
 */

/**
 * @typedef {object} ApplicationsCreateSubSectorBody
 * @property {string} selectedSubSectorName
 */

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
 * Save the sector for the application being created
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
 * Save the sub-sector for the application being created
 *
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateSubSectorProps,
 * {}, ApplicationsCreateSubSectorBody, {}, DomainParams>}
 */
export async function newApplicationsCreateSubSector({ errors, params, body }, response) {
	const applicationId = getParametersApplicationIdOrFail(params, response);
	const { selectedSubSectorName } = body;
	const { sector: applicationSector } = await applicationsCreateService.getApplicationDraft(
		applicationId
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
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateGeographicalInformation(req, response) {
	response.render('applications/create/_geographical-information');
}

/**
 * View the geographical information step of the application creation
 *
 * @param {{applicationId?: string}} params
 * @param {any} response
 * @returns {string}
 */
function getParametersApplicationIdOrFail({ applicationId }, response) {
	return applicationId ?? response.redirect('/app/404');
}

/**
 * Handles draft updating and return error view
 *
 * @param {updateOrCreateCallback} updateOrCreateDraftApplication
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
