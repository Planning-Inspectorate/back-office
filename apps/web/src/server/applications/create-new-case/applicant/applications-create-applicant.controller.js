import { handleErrors } from '../../common/components/error-handler/error-handler.component.js';
import {
	applicantAddressData,
	applicantAddressDataUpdate,
	applicantEmailData,
	applicantEmailDataUpdate,
	applicantFullNameData,
	applicantFullNameDataUpdate,
	applicantOrganisationNameData,
	applicantOrganisationNameDataUpdate,
	applicantTelephoneNumberData,
	applicantTelephoneNumberDataUpdate,
	applicantWebsiteData,
	applicantWebsiteDataUpdate
} from '../../common/components/form/form-applicant.component.js';
import {
	getSessionApplicantInfoTypes,
	setSessionApplicantInfoTypes
} from '../../common/services/session.service.js';
import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';

/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantTypesProps} ApplicationsCreateApplicantTypesProps */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantTypesBody} ApplicationsCreateApplicantTypesBody */
/** @typedef {import('../../common/services/session.service.js').SessionWithApplicationsCreateApplicantInfoTypes} SessionWithApplicationsCreateApplicantInfoTypes */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantOrganisationNameProps} ApplicationsCreateApplicantOrganisationNameProps */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantOrganisationNameBody} ApplicationsCreateApplicantOrganisationNameBody */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantFullNameProps} ApplicationsCreateApplicantFullNameProps */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantFullNameBody} ApplicationsCreateApplicantFullNameBody */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantWebsiteProps} ApplicationsCreateApplicantWebsiteProps */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantWebsiteBody} ApplicationsCreateApplicantWebsiteBody */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantEmailProps} ApplicationsCreateApplicantEmailProps */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantEmailBody} ApplicationsCreateApplicantEmailBody */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantTelephoneNumberProps} ApplicationsCreateApplicantTelephoneNumberProps */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantTelephoneNumberBody} ApplicationsCreateApplicantTelephoneNumberBody */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantAddressProps} ApplicationsCreateApplicantAddressProps */
/** @typedef {import('./applications-create-applicant.types.js').ApplicationsCreateApplicantAddressBody} ApplicationsCreateApplicantAddressBody */

const infoTypesLayout = {
	pageTitle: 'Choose the Applicant information you have available',
	components: ['info-types']
};
const organisationNameLayout = {
	pageTitle: 'Enter the Applicant’s organisation',
	components: ['organisation-name']
};
const fullNameLayout = {
	pageTitle: 'Enter the applicant’s contact name',
	components: ['full-name']
};
const telephoneNumberLayout = {
	pageTitle: 'Enter the Applicant’s phone number',
	components: ['telephone-number']
};
const websiteLayout = { pageTitle: 'Enter the Applicant’s website', components: ['website'] };
const applicantEmailLayout = {
	pageTitle: 'Enter the applicant’s email address',
	components: ['applicant-email']
};
const addressLayout = { pageTitle: 'Enter the Applicant’s address', components: ['address'] };

/**
 * View the form step for the applicant information types
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTypesProps,
 * {}, {}, {}, {}>}
 */
export function viewApplicationsCreateApplicantTypes({ session }, response) {
	const allApplicantInfoTypes = applicationsCreateApplicantService.getAllApplicantInfoTypes();
	const selectedApplicantInfoTypes = getSessionApplicantInfoTypes(session);

	const checkboxApplicantInfoTypes = allApplicantInfoTypes.map((infoType) => ({
		text: infoType.displayNameEn,
		value: infoType.name,
		checked: selectedApplicantInfoTypes.includes(infoType.name)
	}));

	response.render('applications/components/case-form/case-form-layout', {
		applicantInfoTypes: checkboxApplicantInfoTypes,
		layout: infoTypesLayout
	});
}

/**
 * Save the applicant information types in the session
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTypesProps,
 * {}, ApplicationsCreateApplicantTypesBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantTypes({ path, session, body }, response) {
	const { caseId } = response.locals;
	const { selectedApplicantInfoTypes } = body;

	setSessionApplicantInfoTypes(session, selectedApplicantInfoTypes || []);

	goToNextStep(caseId, path, session, response);
}

/**
 * View the form step for the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantOrganisationNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantOrganisationName(request, response) {
	const properties = await applicantOrganisationNameData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: organisationNameLayout
	});
}

/**
 * Update the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantOrganisationNameProps, {}, ApplicationsCreateApplicantOrganisationNameBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantOrganisationName(request, response) {
	const { path, session } = request;
	const { properties, updatedCaseId } = await applicantOrganisationNameDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, organisationNameLayout, response);
	}

	goToNextStep(updatedCaseId, path, session, response);
}

/**
 * View the form step for the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantFullNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantFullName(request, response) {
	const properties = await applicantFullNameData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: fullNameLayout
	});
}

/**
 * Update the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantFullNameProps, {}, ApplicationsCreateApplicantFullNameBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantFullName(request, response) {
	const { path, session } = request;
	const { properties, updatedCaseId } = await applicantFullNameDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, fullNameLayout, response);
	}

	goToNextStep(updatedCaseId, path, session, response);
}

/**
 * View the form step for the applicant email address
 *
 *  @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantEmailProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantEmail(request, response) {
	const properties = await applicantEmailData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: applicantEmailLayout
	});
}

/**
 * Update the applicant email address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantEmailProps, {}, ApplicationsCreateApplicantEmailBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantEmail(request, response) {
	const { path, session } = request;
	const { properties, updatedCaseId } = await applicantEmailDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, applicantEmailLayout, response);
	}

	goToNextStep(updatedCaseId, path, session, response);
}

/**
 * View the form step for the applicant address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
  {}, {}, {postcode: string}, {}>}
 */
export async function viewApplicationsCreateApplicantAddress(request, response) {
	const properties = await applicantAddressData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: addressLayout
	});
}

/**
 * Update the applicant address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
 * {}, ApplicationsCreateApplicantAddressBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantAddress(request, response) {
	const { path, session } = request;
	const { caseId } = response.locals;
	const { properties, shouldShowErrors } = await applicantAddressDataUpdate(
		request,
		response.locals
	);

	if (shouldShowErrors) {
		return handleErrors(properties, addressLayout, response);
	}

	goToNextStep(caseId, path, session, response);
}

/**
 * View the form step for the applicant website
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantWebsiteProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantWebsite(request, response) {
	const properties = await applicantWebsiteData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: websiteLayout
	});
}

/**
 * Update the applicant website
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantWebsiteProps, {}, ApplicationsCreateApplicantWebsiteBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantWebsite(request, response) {
	const { path, session } = request;
	const { properties, updatedCaseId } = await applicantWebsiteDataUpdate(request, response.locals);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, websiteLayout, response);
	}

	goToNextStep(updatedCaseId, path, session, response);
}

/**
 * View the form step for the applicant telephone number
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTelephoneNumberProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantTelephoneNumber(request, response) {
	const properties = await applicantTelephoneNumberData(request, response.locals);

	response.render('applications/components/case-form/case-form-layout', {
		...properties,
		layout: telephoneNumberLayout
	});
}

/**
 * Update the applicant telephone number
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTelephoneNumberProps, {}, ApplicationsCreateApplicantTelephoneNumberBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantTelephoneNumber(request, response) {
	const { properties, updatedCaseId } = await applicantTelephoneNumberDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedCaseId) {
		return handleErrors(properties, telephoneNumberLayout, response);
	}

	response.redirect(`/applications-service/create-new-case/${updatedCaseId}/key-dates`);
}

/**
 * Handle the next allowed destination path and redirects to it
 *
 * @param {number} caseId
 * @param {string} path
 * @param {SessionWithApplicationsCreateApplicantInfoTypes} session
 * @param {*} response
 */
function goToNextStep(caseId, path, session, response) {
	const nextStepPath = applicationsCreateApplicantService.getAllowedDestinationPath({
		session,
		path,
		goToNextPage: true
	});

	response.redirect(`/applications-service/create-new-case/${caseId}/${nextStepPath}`);
}
