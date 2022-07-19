import { isEmpty, pick } from 'lodash-es';
import { mapKeysUsingObject } from '../../utils/mapping/map-keys-using-object.js';
import { mapValuesUsingObject } from '../../utils/mapping/map-values-using-object.js';

/**
 * @param {import('@pins/applications').CreateUpdateApplication} applicationDetails
 * @returns {{
 *  caseDetails?: { title?: string | undefined, description?: string | undefined },
 * 	gridReference?: { easting?: number | undefined, northing?: number | undefined },
 *  application?: { locationDescription?: string | undefined, firstNotifiedAt?: Date | undefined, submissionAt?: Date | undefined, caseEmail?: string | undefined },
 *  subSectorName?: string | undefined,
 *  applicant?: { organisationName?: string | undefined, firstName?: string | undefined, middleName?: string | undefined, lastName?: string | undefined, email?: string | undefined, website?: string | undefined, phoneNumber?: string | undefined},
 *  mapZoomLevelName?: string | undefined,
 *  regionNames?: string[],
 *  applicantAddress?: { addressLine1?: string | undefined, addressLine2?: string | undefined, town?: string | undefined, county?: string | undefined, postcode?: string | undefined}}}
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
			...mapKeysUsingObject(applicationDetails.keyDates, {
				firstNotifiedDate: 'firstNotifiedAt',
				submissionDate: 'submissionAt'
			})
		},
		['locationDescription', 'firstNotifiedAt', 'submissionAt', 'caseEmail']
	);

	const formattedApplicantDetails = pick(applicationDetails.applicant, [
		'organisationName',
		'firstName',
		'middleName',
		'lastName',
		'email',
		'website',
		'phoneNumber'
	]);

	const formattedApplicantAddressDetails = pick(applicationDetails.applicant?.address, [
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
		...(!isEmpty(formattedApplicationDetails) && { application: formattedApplicationDetails }),
		...(applicationDetails.subSectorName && { subSectorName: applicationDetails.subSectorName }),
		...(mapZoomLevelName && { mapZoomLevelName }),
		...(typeof regionNames !== 'undefined' && { regionNames }),
		...(!isEmpty(formattedApplicantDetails) && { applicant: formattedApplicantDetails }),
		...(!isEmpty(formattedApplicantAddressDetails) && {
			applicantAddress: formattedApplicantAddressDetails
		})
	};
};
