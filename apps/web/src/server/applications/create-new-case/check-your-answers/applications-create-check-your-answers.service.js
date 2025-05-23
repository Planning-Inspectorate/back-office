import { addressToString } from '../../../lib/address-formatter.js';
import { nameToString } from '../../../lib/person-name-formatter.js';
import { getErrorMessageCaseCreate } from '../applications-create.service.js';

/** @typedef {import('./applications-create-check-your-answers.types.js').ApplicationsCreateCheckYourAnswersProps} ApplicationsCreateCheckYourAnswersProps */
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

			'applicant.organisationName': caseData?.applicant?.organisationName,
			'applicant.fullName': nameToString(caseData?.applicant),
			'applicant.address': addressToString(caseData?.applicant?.address),
			'applicant.website': caseData?.applicant?.website,
			'applicant.email': caseData?.applicant?.email,
			'applicant.phoneNumber': caseData?.applicant?.phoneNumber,

			'keyDates.preApplication.submissionAtPublished':
				caseData?.keyDates?.preApplication?.submissionAtPublished,
			'keyDates.preApplication.submissionAtInternal':
				caseData?.keyDates?.preApplication?.submissionAtInternal
		}
	};

	return displayData;
};

/**
 * converts api error messages to user display versions
 *
 * @param {import('@pins/express').ValidationErrors} validationErrors
 * @returns { Record<string, string>}
 */
export const mapErrorsToDisplayErrors = (validationErrors) => {
	/** @type {Record<string, string>} */
	const errors = {};

	// expected errors like missing required properties are in an object eg { description: 'Missing description'}
	// but we also need to handle unexpected errors - which will be a string
	if (typeof validationErrors === 'string') {
		errors['Error'] = getErrorMessageCaseCreate('Error', validationErrors);
	} else {
		const errorFieldKeys = Object.keys(validationErrors);

		for (const aField of errorFieldKeys) {
			errors[aField] = getErrorMessageCaseCreate(aField, validationErrors[aField]);
		}
	}

	return errors;
};
