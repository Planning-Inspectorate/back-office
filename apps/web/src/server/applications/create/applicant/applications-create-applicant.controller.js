import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';
import { setSessionApplicantInfoTypes } from './applications-create-applicant-session.service.js';

/** @typedef {import('../../applications.router').DomainParams} DomainParams */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesProps} ApplicationsCreateApplicantTypesProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesBody} ApplicationsCreateApplicantTypesBody */

/**
 * View the form step for the applicant information types
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTypesProps,
 * {}, {}, {}, DomainParams>}
 */
export function viewApplicationsCreateApplicantTypes(req, response) {
	const applicantInfoTypes = applicationsCreateApplicantService.getAllApplicantInfoTypes();

	response.render('applications/create/applicant/_types', { applicantInfoTypes, depth: 1 });
}

/**
 * Save the applicant information types in the session (todo: ?)
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTypesProps,
 * {}, ApplicationsCreateApplicantTypesBody, {}, DomainParams>}
 */
export async function updateApplicationsCreateApplicantTypes({ errors, session, body }, response) {
	const { applicationId } = response.locals;
	const { selectedApplicantInfoTypes } = body;
	const applicantInfoTypes = applicationsCreateApplicantService.getAllApplicantInfoTypes();

	if (errors) {
		return response.render(`applications/create/applicant/_types`, {
			errors,
			applicantInfoTypes,
			depth: 1
		});
	}

	setSessionApplicantInfoTypes(session, selectedApplicantInfoTypes);

	response.redirect(
		`/applications-service/create-new-case/${applicationId}/applicant-organisation-name`
	);
}

/**
 * View the form step for the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantOrganisationName(req, response) {
	response.render('applications/create/applicant/_organisation-name', { depth: 1 });
}

/**
 * Update the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantOrganisationName(req, response) {
	const { applicationId } = response.locals;

	response.redirect(`/applications-service/create-new-case/${applicationId}/applicant-full-name`);
}

/**
 * View the form step for the applicant's full name
 *
@type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantFullName(req, response) {
	response.render('applications/create/applicant/_full-name', { depth: 1 });
}

/**
 * Update the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantFullName(req, response) {
	const { applicationId } = response.locals;

	response.redirect(`/applications-service/create-new-case/${applicationId}/applicant-address`);
}

/**
 * View the form step for the applicant address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantAddress(req, response) {
	response.render('applications/create/applicant/_address', { depth: 1 });
}

/**
 * Update the applicant address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantAddress(req, response) {
	const { applicationId } = response.locals;

	response.redirect(`/applications-service/create-new-case/${applicationId}/applicant-website`);
}

/**
 * View the form step for the applicant website
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantWebsite(req, response) {
	response.render('applications/create/applicant/_website', { depth: 1 });
}

/**
 * Update the applicant website
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantWebsite(req, response) {
	const { applicationId } = response.locals;

	response.redirect(`/applications-service/create-new-case/${applicationId}/applicant-email`);
}

/**
 * View the form step for the applicant email address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantEmail(req, response) {
	response.render('applications/create/applicant/_email', { depth: 1 });
}

/**
 * Update the applicant email address
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function updateApplicationsCreateApplicantEmail(req, response) {
	const { applicationId } = response.locals;

	response.redirect(
		`/applications-service/create-new-case/${applicationId}/applicant-telephone-number`
	);
}

/**
 * View the form step for the applicant telephone number
 *
 * @type {import('@pins/express').RenderHandler<{}, {}>}
 */
export async function viewApplicationsCreateApplicantTelephoneNumber(req, response) {
	response.render('applications/create/applicant/_telephone-number', { depth: 1 });
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
