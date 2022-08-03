import { findAddressListByPostcode } from '@planning-inspectorate/address-lookup';
import { bodyToPayload } from '../../../lib/body-formatter.js';
import { updateApplicationDraft } from '../applications-create.service.js';
import * as applicationsCreateApplicantService from './applications-create-applicant.service.js';
import {
	getSessionApplicantInfoTypes,
	setSessionApplicantInfoTypes
} from './applications-create-applicant-session.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types').ApplicationsAddress} ApplicationsAddress */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesProps} ApplicationsCreateApplicantTypesProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantTypesBody} ApplicationsCreateApplicantTypesBody */
/** @typedef {import('./applications-create-applicant-session.service.js').SessionWithApplicationsCreateApplicantInfoTypes} SessionWithApplicationsCreateApplicantInfoTypes */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantOrganisationNameProps} ApplicationsCreateApplicantOrganisationNameProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantOrganisationNameBody} ApplicationsCreateApplicantOrganisationNameBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantFullNameProps} ApplicationsCreateApplicantFullNameProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantFullNameBody} ApplicationsCreateApplicantFullNameBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantAddressProps} ApplicationsCreateApplicantAddressProps */
/** @typedef {import('./applications-create-applicant.types').ApplicationsCreateApplicantAddressBody} ApplicationsCreateApplicantAddressBody */
/** @typedef {import('./applications-create-applicant.types').ApplicationCreateApplicantAddressStage} ApplicationCreateApplicantAddressStage */

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

	response.render('applications/create/applicant/_types', {
		applicantInfoTypes: checkboxApplicantInfoTypes
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
export async function viewApplicationsCreateApplicantOrganisationName(req, response) {
	response.render('applications/create/applicant/_organisation-name');
}

/**
 * Update the applicant organisation name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantOrganisationNameProps, {}, ApplicationsCreateApplicantOrganisationNameBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantOrganisationName(
	{ path, session },
	response
) {
	const { applicationId } = response.locals;

	// TODO - should be written to DB
	// const { applicant.organisationName } = body;

	goToNextStep(applicationId, path, session, response);
}

/**
 * View the form step for the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantFullNameProps, {}, {}, {}, {}>}
 */
export async function viewApplicationsCreateApplicantFullName(req, response) {
	response.render('applications/create/applicant/_full-name');
}

/**
 * Update the applicant's full name
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantFullNameProps, {}, ApplicationsCreateApplicantFullNameBody, {}, {}>}
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
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
  {}, {}, {postcode: string}, {}>}
 */
export async function viewApplicationsCreateApplicantAddress({ query }, response) {
	const { postcode } = query;
	const formStage = postcode ? 'manualAddress' : 'searchPostcode';

	response.render('applications/create/applicant/_address', { formStage, postcode });
}

/**
 * Update the applicant address
 *
 * @type {import('@pins/express').RenderHandler<ApplicationsCreateApplicantAddressProps,
 * {}, ApplicationsCreateApplicantAddressBody, {}, {}>}
 */
export async function updateApplicationsCreateApplicantAddress(
	{ path, session, errors: validationErrors, body },
	response
) {
	const { postcode, apiReference, currentFormStage } = body;
	const { applicationId, applicantId } = response.locals;

	const {
		/** @type {ValidationErrors} */ errors: apiErrors,
		/** @type {ApplicationsAddress[]} */ addressList: matchingAddressList,
		/** @type {ApplicationCreateApplicantAddressStage} */ formStage = currentFormStage
	} = await (async () => {
		switch (currentFormStage) {
			case 'searchPostcode': {
				const { errors, addressList } = await findAddressListByPostcode(postcode, {
					maxResults: 50,
					minMatch: 0.9
				});
				const newFormStage = errors ? 'searchPostcode' : 'selectAddress';

				return { errors, addressList, formStage: newFormStage };
			}
			case 'selectAddress': {
				const { errors: serviceErrors, addressList } = await findAddressListByPostcode(postcode, {
					maxResults: 50,
					minMatch: 0.9
				});
				const selectedAddress = addressList.find(
					(address) => address.apiReference === apiReference
				);
				const payload = { applicant: { id: applicantId, address: selectedAddress } };
				const { errors: updateErrors } = await updateApplicationDraft(applicationId, payload);

				return { errors: serviceErrors || updateErrors, addressList };
			}
			case 'manualAddress': {
				const payload = bodyToPayload(body);

				payload.applicant.address.postcode = postcode;
				payload.applicant.id = applicantId;

				const { errors } = await updateApplicationDraft(applicationId, payload);

				return { errors };
			}
			default: {
				return { errors: { formStage: { msg: 'An error occurred, please try again later' } } };
			}
		}
	})();

	const errors = validationErrors || apiErrors;

	if (errors || (!apiReference && formStage === 'selectAddress')) {
		return response.render('applications/create/applicant/_address', {
			errors,
			formStage,
			postcode,
			addressList: matchingAddressList
		});
	}

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
