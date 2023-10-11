import { isEmpty, pick } from 'lodash-es';
import { mapValuesUsingObject } from '#utils/mapping/map-values-using-object.js';

/**
 * @param {import('@pins/applications').CreateUpdateApplication} applicationDetails
 * @returns {import('../../repositories/case.repository').CreateApplicationParams}
 */
export const mapCreateApplicationRequestToRepository = (applicationDetails) => {
	const formattedCaseDetails = pick(applicationDetails, ['title', 'description']);

	const formattedGridReferenceDetails = mapValuesUsingObject(
		pick(applicationDetails.geographicalInformation?.gridReference, ['easting', 'northing']),
		{ easting: Number, northing: Number }
	);

	const formattedApplicationDetails = pick(
		{
			...applicationDetails,
			...applicationDetails.geographicalInformation,
			...applicationDetails.keyDates?.preApplication
		},
		['locationDescription', 'submissionAtInternal', 'submissionAtPublished', 'caseEmail']
	);

	const applicant = applicationDetails?.applicant;
	const formattedApplicantDetails = pick(applicant, [
		'organisationName',
		'firstName',
		'middleName',
		'lastName',
		'email',
		'website',
		'phoneNumber'
	]);

	const formattedApplicantAddressDetails = pick(applicant?.address, [
		'addressLine1',
		'addressLine2',
		'town',
		'county',
		'postcode'
	]);

	const regionNames = applicationDetails.geographicalInformation?.regionNames;

	const mapZoomLevelName = applicationDetails?.geographicalInformation?.mapZoomLevelName;

	return {
		...(!isEmpty(formattedCaseDetails) && { caseDetails: formattedCaseDetails }),
		...(!isEmpty(formattedGridReferenceDetails) && {
			gridReference: formattedGridReferenceDetails
		}),
		...(!isEmpty(formattedApplicationDetails) && {
			applicationDetails: formattedApplicationDetails
		}),
		...(applicationDetails.subSectorName && { subSectorName: applicationDetails.subSectorName }),
		...(mapZoomLevelName && { mapZoomLevelName }),
		...(typeof regionNames !== 'undefined' && { regionNames }),
		...(!isEmpty(formattedApplicantDetails) && { applicant: formattedApplicantDetails }),
		...(!isEmpty(formattedApplicantAddressDetails) && {
			applicantAddress: formattedApplicantAddressDetails
		}),
		...(applicationDetails.stage && { caseStatus: { status: applicationDetails.stage } })
	};
};
