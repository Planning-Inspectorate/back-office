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
} from '../../../../components/form/form-applicant-components.controller.js';
import { handleErrors } from '../../../create/case/applications-create-case.controller.js';

/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantTypesProps} ApplicationsCreateApplicantTypesProps */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantTypesBody} ApplicationsCreateApplicantTypesBody */
/** @typedef {import('../../../create/applicant/applications-create-applicant-session.service.js').SessionWithApplicationsCreateApplicantInfoTypes} SessionWithApplicationsCreateApplicantInfoTypes */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantOrganisationNameProps} ApplicationsCreateApplicantOrganisationNameProps */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantOrganisationNameBody} ApplicationsCreateApplicantOrganisationNameBody */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantFullNameProps} ApplicationsCreateApplicantFullNameProps */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantFullNameBody} ApplicationsCreateApplicantFullNameBody */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantWebsiteProps} ApplicationsCreateApplicantWebsiteProps */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantWebsiteBody} ApplicationsCreateApplicantWebsiteBody */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantEmailProps} ApplicationsCreateApplicantEmailProps */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantEmailBody} ApplicationsCreateApplicantEmailBody */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantTelephoneNumberProps} ApplicationsCreateApplicantTelephoneNumberProps */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantTelephoneNumberBody} ApplicationsCreateApplicantTelephoneNumberBody */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantAddressProps} ApplicationsCreateApplicantAddressProps */
/** @typedef {import('../../../create/applicant/applications-create-applicant.types.js').ApplicationsCreateApplicantAddressBody} ApplicationsCreateApplicantAddressBody */

const organisationNameLayout = {
	pageTitle: 'Enter the Applicant’s organisation',
	components: ['organisation-name'],
	isEdit: true
};
const fullNameLayout = {
	pageTitle: 'Enter the Applicant’s contact name',
	components: ['full-name'],
	isEdit: true
};
const telephoneNumberLayout = {
	pageTitle: 'Enter the Applicant’s phone number',
	components: ['telephone-number'],
	isEdit: true
};
const websiteLayout = {
	pageTitle: 'Enter the Applicant’s website',
	components: ['website'],
	isEdit: true
};
const applicantEmailLayout = {
	pageTitle: 'Enter the Applicant’s email address',
	components: ['applicant-email'],
	isEdit: true
};
const addressLayout = {
	pageTitle: 'Enter the Applicant’s address',
	components: ['address'],
	isEdit: true
};

const addressReadOnlyLayout = {
	pageTitle: 'Enter the Applicant’s address',
	components: ['address-view'],
	isEdit: true
};

/**
 * View the form step for the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantOrganisationNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditApplicantOrganisationName(request, response) {
	const properties = await applicantOrganisationNameData(request, response.locals);

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
export async function updateApplicationsEditApplicantOrganisationName(request, response) {
	const { properties, updatedApplicationId } = await applicantOrganisationNameDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, organisationNameLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedApplicationId}/project-information`);
}

/**
 * View the form step for the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantFullNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditApplicantFullName(request, response) {
	const properties = await applicantFullNameData(request, response.locals);

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
export async function updateApplicationsEditApplicantFullName(request, response) {
	const { properties, updatedApplicationId } = await applicantFullNameDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, fullNameLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedApplicationId}/project-information`);
}

/**
 * View the form step for the applicant email address
 *
 *  @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantEmailProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditApplicantEmail(request, response) {
	const properties = await applicantEmailData(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
		...properties,
		layout: applicantEmailLayout
	});
}

/**
 * Edit the applicant email address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantEmailProps, {}, ApplicationsCreateApplicantEmailBody, {}, {}>}
 */
export async function updateApplicationsEditApplicantEmail(request, response) {
	const { properties, updatedApplicationId } = await applicantEmailDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, applicantEmailLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedApplicationId}/project-information`);
}

/**
 * View the form step for the applicant address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
  {}, {}, {postcode: string}, {}>}
 */
export async function viewApplicationsEditApplicantAddressReadyOnly(request, response) {
	const properties = await applicantAddressData(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
		...properties,
		layout: addressReadOnlyLayout
	});
}

/**
 * View the form step for the applicant address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
  {}, {}, {postcode: string}, {}>}
 */
export async function viewApplicationsEditApplicantAddress(request, response) {
	const properties = await applicantAddressData(request, response.locals);

	response.render('applications/case-form/case-form-layout', {
		...properties,
		layout: addressLayout
	});
}

/**
 * Edit the applicant address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
 * {}, ApplicationsCreateApplicantAddressBody, {}, {}>}
 */
export async function updateApplicationsEditApplicantAddress(request, response) {
	const { applicationId } = response.locals;
	const { properties, shouldShowErrors } = await applicantAddressDataUpdate(
		request,
		response.locals
	);

	if (shouldShowErrors) {
		return handleErrors(properties, addressLayout, response);
	}

	response.redirect(`/applications-service/case/${applicationId}/project-information`);
}

/**
 * View the form step for the applicant website
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantWebsiteProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditApplicantWebsite(request, response) {
	const properties = await applicantWebsiteData(request, response.locals);

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
export async function updateApplicationsEditApplicantWebsite(request, response) {
	const { properties, updatedApplicationId } = await applicantWebsiteDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, websiteLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedApplicationId}/project-information`);
}

/**
 * View the form step for the applicant telephone number
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantTelephoneNumberProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsEditApplicantTelephoneNumber(request, response) {
	const properties = await applicantTelephoneNumberData(request, response.locals);

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
export async function updateApplicationsEditApplicantTelephoneNumber(request, response) {
	const { properties, updatedApplicationId } = await applicantTelephoneNumberDataUpdate(
		request,
		response.locals
	);

	if (properties.errors || !updatedApplicationId) {
		return handleErrors(properties, telephoneNumberLayout, response);
	}

	response.redirect(`/applications-service/case/${updatedApplicationId}/project-information`);
}
