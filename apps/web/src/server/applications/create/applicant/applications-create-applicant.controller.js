import {
	formatUpdateApplicantAddress,
	formatUpdateApplicantFullName,
	formatUpdateApplicantOrganisationName,
	formatUpdateApplicantTelephoneNumber,
	formatUpdateApplicantWebsite,
	formatUpdateApplicationsCreateApplicantEmail,
	formatViewApplicantAddress,
	formatViewApplicantEmail,
	formatViewApplicantFullName,
	formatViewApplicantOrganisationName,
	formatViewApplicantTelephoneNumber,
	formatViewApplicantWebsite
} from '../../components/form/form-applicant-components.controller.js';
import { handleErrors } from '../case/applications-create-case.controller.js';
import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';
import {
	getSessionApplicantInfoTypes,
	setSessionApplicantInfoTypes
} from './applications-create-applicant-session.service.js';

/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesProps} ApplicationsCreateApplicantTypesProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesBody} ApplicationsCreateApplicantTypesBody */
/** @typedef {import('./applications-create-applicant-session.service.js').SessionWithApplicationsCreateApplicantInfoTypes} SessionWithApplicationsCreateApplicantInfoTypes */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantOrganisationNameProps} ApplicationsCreateApplicantOrganisationNameProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantOrganisationNameBody} ApplicationsCreateApplicantOrganisationNameBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantFullNameProps} ApplicationsCreateApplicantFullNameProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantFullNameBody} ApplicationsCreateApplicantFullNameBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantWebsiteProps} ApplicationsCreateApplicantWebsiteProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantWebsiteBody} ApplicationsCreateApplicantWebsiteBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantEmailProps} ApplicationsCreateApplicantEmailProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantEmailBody} ApplicationsCreateApplicantEmailBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTelephoneNumberProps} ApplicationsCreateApplicantTelephoneNumberProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTelephoneNumberBody} ApplicationsCreateApplicantTelephoneNumberBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantAddressProps} ApplicationsCreateApplicantAddressProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantAddressBody} ApplicationsCreateApplicantAddressBody */

const infoTypesLayout = {
	pageTitle: 'Choose the type of Applicant information you can give',
	components: ['info-types']
};
const organisationNameLayout = {
	pageTitle: 'What is the applicant’s organisation?',
	components: ['organisation-name']
};
const fullNameLayout = {
	pageTitle: 'What is the applicant’s full name?',
	components: ['full-name']
};
const telephoneNumberLayout = {
	pageTitle: 'What’s the applicant’s phone number?',
	components: ['telephone-number']
};
const websiteLayout = { pageTitle: 'What’s the applicant’s website?', components: ['website'] };
const applicantEmailLayout = {
	pageTitle: 'What’s the applicant’s email address?',
	components: ['applicant-email']
};
const addressLayout = { pageTitle: 'What’s the applicant’s address?', components: ['address'] };

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

	response.render('applications/case-form/case-form-layout', {
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
	const { applicationId } = response.locals;
	const { selectedApplicantInfoTypes } = body;

	setSessionApplicantInfoTypes(session, selectedApplicantInfoTypes || []);

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantOrganisationNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantOrganisationName(request, response) {
	const properties = await formatViewApplicantOrganisationName(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
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
	const { properties, updatedApplicationId } = await formatUpdateApplicantOrganisationName(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, organisationNameLayout, response);
	}

	goToNextStep(updatedApplicationId, path, session, response);
}

/**
 * View the form step for the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantFullNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantFullName(request, response) {
	const properties = await formatViewApplicantFullName(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
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
	const { properties, updatedApplicationId } = await formatUpdateApplicantFullName(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, fullNameLayout, response);
	}

	goToNextStep(updatedApplicationId, path, session, response);
}

/**
 * View the form step for the applicant email address
 *
 *  @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantEmailProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantEmail(request, response) {
	const properties = await formatViewApplicantEmail(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
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
	const { properties, updatedApplicationId } = await formatUpdateApplicationsCreateApplicantEmail(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, applicantEmailLayout, response);
	}

	goToNextStep(updatedApplicationId, path, session, response);
}

/**
 * View the form step for the applicant address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
  {}, {}, {postcode: string}, {}>}
 */
export async function viewApplicationsCreateApplicantAddress(request, response) {
	const properties = await formatViewApplicantAddress(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
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
	const { applicationId } = response.locals;
	const { properties, shouldShowErrors } = await formatUpdateApplicantAddress(
		request,
		response.locals
	);

	if (shouldShowErrors) {
		return handleErrors(properties, addressLayout, response);
	}

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant website
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantWebsiteProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantWebsite(request, response) {
	const properties = await formatViewApplicantWebsite(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
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
	const { properties, updatedApplicationId } = await formatUpdateApplicantWebsite(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, websiteLayout, response);
	}

	goToNextStep(updatedApplicationId, path, session, response);
}

/**
 * View the form step for the applicant telephone number
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTelephoneNumberProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantTelephoneNumber(request, response) {
	const properties = await formatViewApplicantTelephoneNumber(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
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
	const { properties, updatedApplicationId } = await formatUpdateApplicantTelephoneNumber(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, telephoneNumberLayout, response);
	}

	response.redirect(`/applications-service/create-new-case/${updatedApplicationId}/key-dates`);
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
