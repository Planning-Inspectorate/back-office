import { getErrorMessageCaseCreate } from '../applications-create.service.js';

/** @typedef {import('./applications-create-check-your-answers.types').ApplicationsCreateCheckYourAnswersProps} ApplicationsCreateCheckYourAnswersProps */
/** @typedef {import('../../applications.types').ApplicationsAddress} ApplicationsAddress */

/**
 * converts the draft aplication case data to values array for display
 *
 * @param {*} caseData
 * @returns {ApplicationsCreateCheckYourAnswersProps}
 */
export const mapCaseData = (caseData) => {
	// read the draft case from DB
	// and set up the values array for rendering
	const displayData = {
		values: {
			'case.title': caseData.title,
			'case.description': caseData.description,
			'case.sector': caseData?.sector?.displayNameEn,
			'case.subSector': caseData?.subSector?.displayNameEn,
			'case.location': caseData?.geographicalInformation?.locationDescription,
			'case.easting': caseData?.geographicalInformation?.gridReference?.easting,
			'case.northing': caseData?.geographicalInformation?.gridReference?.northing,
			'case.regions': caseData?.geographicalInformation?.regions?.map(
				(/** @type {{ displayNameEn: string; }} */ region) => region.displayNameEn
			),
			'case.zoomLevel': caseData?.geographicalInformation?.mapZoomLevel?.displayNameEn,
			'case.teamEmail': caseData?.caseEmail,

			'applicant.organisationName': caseData?.applicants[0].organisationName,
			'applicant.firstName': caseData?.applicants[0].firstName,
			'applicant.middleName': caseData?.applicants[0].middleName,
			'applicant.lastName': caseData?.applicants[0].lastName,
			'applicant.address': caseData?.applicants[0].address
				? addressToString(caseData?.applicants[0].address)
				: '',
			'applicant.website': caseData?.applicants[0].website,
			'applicant.email': caseData?.applicants[0].email,
			'applicant.phoneNumber': caseData?.applicants[0].phoneNumber,

			'keyDates.submissionDatePublished': caseData?.keyDates?.submissionDatePublished,
			'keyDates.submissionDateInternal': new Date(
				caseData?.keyDates?.submissionDateInternal * 1000
			).toLocaleDateString('en-GB')
		}
	};

	return displayData;
};

/**
 * converts a multi part address to a single string
 *
 * @param {ApplicationsAddress} address
 * @returns {string}
 */
function addressToString(address) {
	let returnValue = '';

	const addressParts = [];

	if (address) {
		if (address.addressLine1) addressParts.push(address.addressLine1.trim());
		if (address.addressLine2) addressParts.push(address.addressLine2.trim());
		if (address.town) addressParts.push(address.town.trim());
		if (address.postCode) addressParts.push(address.postCode.trim());

		returnValue = addressParts.join(', ');
	}
	return returnValue;
}

/**
 * converts api error messages to user display versions
 *
 * @param {import('@pins/express').ValidationErrors} validationErrors
 * @returns { Record<string, string>}
 */
export const mapErrorsToDisplayErrors = (validationErrors) => {
	const errorFieldKeys = Object.keys(validationErrors);
	/** @type {Record<string, string>} */
	const errors = {};

	for (const aField of errorFieldKeys) {
		errors[aField] = getErrorMessageCaseCreate(aField, validationErrors[aField]);
	}

	return errors;
};
