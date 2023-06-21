import { findAddressListByPostcode } from '@planning-inspectorate/address-lookup';
import { getApplicantById } from '../../services/applicant.service.js';
import { updateCase } from '../../services/case.service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../../applications.types').ApplicationsAddress} ApplicationsAddress */
/** @typedef {import('../../../create-new-case/applicant/applications-create-applicant.types').ApplicationCreateApplicantAddressStage} ApplicationCreateApplicantAddressStage */
/** @typedef {import('../../../create-new-case/applicant/applications-create-applicant.types').ApplicationsCreateApplicantAddressProps} ApplicationsCreateApplicantAddressProps */
/** @typedef {import('../../../create-new-case/applicant/applications-create-applicant.types').ApplicationsCreateApplicantOrganisationNameProps} ApplicationsCreateApplicantOrganisationNameProps */
/** @typedef {import('../../../create-new-case/applicant/applications-create-applicant.types').ApplicationsCreateApplicantFullNameProps} ApplicationsCreateApplicantFullNameProps */
/** @typedef {import('../../../create-new-case/applicant/applications-create-applicant.types').ApplicationsCreateApplicantWebsiteProps} ApplicationsCreateApplicantWebsiteProps */
/** @typedef {import('../../../create-new-case/applicant/applications-create-applicant.types').ApplicationsCreateApplicantEmailProps} ApplicationsCreateApplicantEmailProps */
/** @typedef {import('../../../create-new-case/applicant/applications-create-applicant.types').ApplicationsCreateApplicantTelephoneNumberProps} ApplicationsCreateApplicantTelephoneNumberProps */

/**
 * Format properties for applicant organisation page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateApplicantOrganisationNameProps>}
 */
export async function applicantOrganisationNameData(request, locals) {
	const { currentCase, applicantId } = locals;

	const applicant = await getApplicantById(currentCase, applicantId);
	const values = {
		'applicant.organisationName': applicant?.organisationName
	};

	return { values };
}

/**
 * Format properties for applicant organisation update page *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties:ApplicationsCreateApplicantOrganisationNameProps, updatedCaseId?:number }>}
 */
export async function applicantOrganisationNameDataUpdate({ body }, locals) {
	const { caseId, applicantId: id } = locals;
	const organisationName = body['applicant.organisationName'];
	const applicantInfo = { id, organisationName };

	const { errors, id: updatedCaseId } = await updateCase(caseId, {
		applicants: [applicantInfo]
	});

	return {
		properties: {
			errors,
			values: { 'applicant.organisationName': organisationName }
		},
		updatedCaseId
	};
}

/**
 * Format properties for applicant full name  page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateApplicantFullNameProps>}
 */
export async function applicantFullNameData(request, locals) {
	const { currentCase, applicantId } = locals;

	const applicant = await getApplicantById(currentCase, applicantId);
	const values = {
		'applicant.firstName': applicant?.firstName,
		'applicant.middleName': applicant?.middleName,
		'applicant.lastName': applicant?.lastName
	};

	return { values };
}

/**
 * Format properties for applicant full name update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties:ApplicationsCreateApplicantFullNameProps, updatedCaseId?:number }>}
 */
export async function applicantFullNameDataUpdate({ body }, locals) {
	const { caseId, applicantId: id } = locals;
	const applicantInfo = {
		id,
		firstName: body['applicant.firstName'],
		middleName: body['applicant.middleName'],
		lastName: body['applicant.lastName']
	};

	const { errors, id: updatedCaseId } = await updateCase(caseId, {
		applicants: [applicantInfo]
	});

	return { properties: { errors, values: body }, updatedCaseId };
}

/**
 * Format properties for applicant email page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateApplicantEmailProps>}
 */
export async function applicantEmailData(request, locals) {
	const { currentCase, applicantId } = locals;

	const applicant = await getApplicantById(currentCase, applicantId);
	const values = {
		'applicant.email': applicant?.email
	};

	return { values };
}

/**
 * Format properties for applicant email update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties:ApplicationsCreateApplicantEmailProps, updatedCaseId?:number }>}
 */
export async function applicantEmailDataUpdate({ errors: validationErrors, body }, locals) {
	const { caseId, applicantId: id } = locals;
	const values = body;
	const applicantInfo = { id, email: body['applicant.email'] };

	const { errors: apiErrors, id: updatedCaseId } = await updateCase(caseId, {
		applicants: [applicantInfo]
	});

	return { properties: { errors: validationErrors || apiErrors, values }, updatedCaseId };
}

/**
 * Format properties for applicant address page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateApplicantAddressProps>}
 */
export async function applicantAddressData({ query }, locals) {
	const { postcode: queryPostcode } = query;
	const { currentCase, applicantId } = locals;

	const applicant = await getApplicantById(currentCase, applicantId);
	const singlePostcode = queryPostcode ? `${queryPostcode}` : null;
	const trimAddressPart = (/** @type {string | undefined} */ addressPart) =>
		addressPart ? `${addressPart.trim()}, ` : '';

	let applicantAddress = '';

	if (applicant?.address) {
		const { address } = applicant;

		applicantAddress = `${trimAddressPart(address.addressLine1)}${trimAddressPart(
			address.addressLine2
		)}${trimAddressPart(address.town)}${trimAddressPart(address.postCode)}`;
	}

	const postcode = singlePostcode || applicant?.address?.postCode;
	const formStage = queryPostcode ? 'manualAddress' : 'searchPostcode';

	return { formStage, postcode, applicantAddress };
}

/**
 * Format properties for applicant address update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties: ApplicationsCreateApplicantAddressProps, shouldShowErrors: boolean }>}
 */
export async function applicantAddressDataUpdate({ errors: validationErrors, body }, locals) {
	const { postcode, apiReference, currentFormStage } = body;
	const { caseId, applicantId } = locals;

	const {
		/** @type {ValidationErrors} */ errors: apiErrors,
		/** @type {ApplicationsAddress[]} */ addressList: matchingAddressList,
		/** @type {ApplicationCreateApplicantAddressStage} */ formStage = currentFormStage
	} = await (async () => {
		switch (currentFormStage) {
			case 'searchPostcode': {
				const { errors: serviceErrors, addressList } = await findAddressListByPostcode(postcode, {
					maxResults: 50
				});
				const errors = validationErrors || serviceErrors;
				const newFormStage = errors ? 'searchPostcode' : 'selectAddress';

				return { errors, addressList, formStage: newFormStage };
			}
			case 'selectAddress': {
				const { errors: serviceErrors, addressList } = await findAddressListByPostcode(postcode, {
					maxResults: 50
				});

				const selectedAddress = addressList.find(
					(address) => address.apiReference === apiReference
				);
				const payload = { applicants: [{ id: applicantId, address: selectedAddress }] };
				const { errors: updateErrors } = await updateCase(caseId, payload);

				return { errors: serviceErrors || updateErrors, addressList };
			}
			case 'manualAddress': {
				const payload = {
					applicants: [
						{
							id: applicantId,
							address: {
								postcode,
								addressLine1: body['applicant.address.addressLine1'],
								addressLine2: body['applicant.address.addressLine2'],
								town: body['applicant.address.town']
							}
						}
					]
				};

				const { errors } = await updateCase(caseId, payload);

				return { errors };
			}
			default: {
				return { errors: { formStage: { msg: 'An error occurred, please try again later' } } };
			}
		}
	})();

	const errors = validationErrors || apiErrors;
	const shouldShowErrors = !!(errors || (!apiReference && formStage === 'selectAddress'));
	const properties = {
		errors,
		formStage,
		postcode,
		addressList: matchingAddressList
	};

	return { properties, shouldShowErrors };
}

/**
 * Format properties for applicant website  page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateApplicantWebsiteProps>}
 */
export async function applicantWebsiteData(request, locals) {
	const { currentCase, applicantId } = locals;

	const applicant = await getApplicantById(currentCase, applicantId);
	const values = {
		'applicant.website': applicant?.website
	};

	return { values };
}

/**
 * Format properties for applicant website update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties:ApplicationsCreateApplicantWebsiteProps, updatedCaseId?:number }>}
 */
export async function applicantWebsiteDataUpdate({ body, errors: validationErrors }, locals) {
	const { caseId, applicantId: id } = locals;
	const values = body;
	const website = body['applicant.website'];
	const applicantInfo = { id, website };

	const { errors: apiErrors, id: updatedCaseId } = await updateCase(caseId, {
		applicants: [applicantInfo]
	});

	const properties = {
		errors: validationErrors || apiErrors,
		values
	};

	return { properties, updatedCaseId };
}

/**
 * Format properties for applicant telephone number page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<ApplicationsCreateApplicantTelephoneNumberProps>}
 */
export async function applicantTelephoneNumberData(request, locals) {
	const { currentCase, applicantId } = locals;

	const applicant = await getApplicantById(currentCase, applicantId);
	const values = {
		'applicant.phoneNumber': applicant?.phoneNumber
	};

	return { values };
}

/**
 * Format properties for applicant telephone number update page
 *
 *
 * @param {import('express').Request} request
 * @param {Record<string, any>} locals
 * @returns {Promise<{properties:ApplicationsCreateApplicantTelephoneNumberProps, updatedCaseId?:number }>}
 */
export async function applicantTelephoneNumberDataUpdate(
	{ body, errors: validationErrors },
	locals
) {
	const { caseId, applicantId: id } = locals;
	const values = body;
	const phoneNumber = body['applicant.phoneNumber'];
	const applicantInfo = { id, phoneNumber };

	const { errors: apiErrors, id: updatedCaseId } = await updateCase(caseId, {
		applicants: [applicantInfo]
	});
	const properties = { errors: validationErrors || apiErrors, values };

	return { properties, updatedCaseId };
}
