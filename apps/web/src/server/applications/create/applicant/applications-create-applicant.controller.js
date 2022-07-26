import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';
import {
	getSessionApplicantInfoTypes,
	setSessionApplicantInfoTypes
} from './applications-create-applicant-session.service.js';

/** @typedef {import('../../applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesProps} ApplicationsCreateApplicantTypesProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesBody} ApplicationsCreateApplicantTypesBody */
/** @typedef {import('./applications-create-applicant-session.service.js').SessionWithApplicationsCreateApplicantInfoTypes} SessionWithApplicationsCreateApplicantInfoTypes */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantOrganisationNameProps} ApplicationsCreateApplicantOrganisationNameProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantOrganisationNameBody} ApplicationsCreateApplicantOrganisationNameBody */

/**
 * View the form step for the applicant information types
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTypesProps,
 * {}, {}, {}, DomainParams>}
 */
export function viewApplicationsCreateApplicantTypes({ session }, response) {
	const allApplicantInfoTypes = applicationsCreateApplicantService.getAllApplicantInfoTypes();
	const selectedApplicantInfoTypes = getSessionApplicantInfoTypes(session);

	const checkboxApplicantInfoTypes = allApplicantInfoTypes.map((infoType) => ({
		text: infoType.displayNameEn,
		value: infoType.name,
		checked: selectedApplicantInfoTypes.includes(infoType.name)
	}));

	response.render('applications/create/applicant/_types', {
		applicantInfoTypes: checkboxApplicantInfoTypes
	});
}

/**
 * Save the applicant information types in the session
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTypesProps,
 * {}, ApplicationsCreateApplicantTypesBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateApplicantTypes({ path, session, body }, response) {
	const { applicationId } = response.locals;
	const { selectedApplicantInfoTypes } = body;

	setSessionApplicantInfoTypes(session, selectedApplicantInfoTypes || []);

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantOrganisationNameProps, {}, {}, {}, DomainParams>}
 */
export async function viewApplicationsCreateApplicantOrganisationName(req, response) {
	response.render('applications/create/applicant/_organisation-name');
}

/**
 * Update the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantOrganisationNameProps, {}, ApplicationsCreateApplicantOrganisationNameBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateApplicantOrganisationName(
	{ path, session },
	response
) {
	const { applicationId } = response.locals;

	// TODO - should be written to DB
	// const { applicantOrganisationName } = body;

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant's full name
 *
@type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantFullName(req, response) {
	response.render('applications/create/applicant/_full-name');
}

/**
 * Update the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantFullName({ path, session }, response) {
	const { applicationId } = response.locals;

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant email address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantEmail(req, response) {
	response.render('applications/create/applicant/_email');
}

/**
 * Update the applicant email address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantEmail({ path, session }, response) {
	const { applicationId } = response.locals;

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantAddress(req, response) {
	response.render('applications/create/applicant/_address');
}

/**
 * Update the applicant address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantAddress({ path, session }, response) {
	const { applicationId } = response.locals;

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant website
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantWebsite(req, response) {
	response.render('applications/create/applicant/_website');
}

/**
 * Update the applicant website
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantWebsite({ path, session }, response) {
	const { applicationId } = response.locals;

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant telephone number
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantTelephoneNumber(req, response) {
	response.render('applications/create/applicant/_telephone-number');
}

/**
 * Update the applicant telephone number
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantTelephoneNumber(req, response) {
	const { applicationId } = response.locals;

	response.redirect(`/applications-service/create-new-case/${applicationId}/key-dates`);
}

/**
 * Handle the next allowed destination path and redirects to it
 *
 * @param {number} applicationId
 * @param {string} path
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @param {*} response
 */
function goToNextStep(applicationId, path, session, response) {
	const nextStepPath = applicationsCreateApplicantService.getAllowedDestinationPath({
		session,
		path,
		goToNextPage: true
	});

	response.redirect(`/applications-service/create-new-case/${applicationId}/${nextStepPath}`);
}
