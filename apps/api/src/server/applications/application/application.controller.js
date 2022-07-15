import { isEmpty, pick } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import { mapKeysUsingObject } from '../../utils/mapping/map-keys-using-object.js';

/**
 * @param {import('@pins/applications').CreateUpdateApplication} applicationDetails
 * @returns {{
 *  caseDetails?: import('@pins/api').Schema.Case,
 * 	gridReference?: import('@pins/api').Schema.GridReference,
 *  application?: import('@pins/api').Schema.ApplicationDetails,
 *  applicant?: import('@pins/api').Schema.ServiceCustomer,
 *  applicantAddress?: import('@pins/api').Schema.Address}}
 */
const mapCreateApplicationRequestToRepository = (applicationDetails) => {
	const formattedCaseDetails = pick(applicationDetails, ['title', 'description']);

	const formattedGridReferenceDetails = pick(
		applicationDetails.geographicalInformation?.gridReference,
		['easting', 'northing']
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
		['locationDescription', 'firstNotifiedAt', 'submissionAt']
	);

	const formattedApplicantDetails = pick(applicationDetails.applicant, [
		'organisationName',
		'firstName',
		'middleName',
		'lastName',
		'email',
		'website',
		'email',
		'phoneNumber'
	]);

	const formattedApplicantAddressDetails = pick(applicationDetails.applicant?.address, [
		'addressLine1',
		'addressLine2',
		'town',
		'county',
		'postcode'
	]);

	return {
		...(!isEmpty(formattedCaseDetails) && { caseDetails: formattedCaseDetails }),
		...(!isEmpty(formattedGridReferenceDetails) && {
			gridReference: formattedGridReferenceDetails
		}),
		...(!isEmpty(formattedApplicationDetails) && { application: formattedApplicationDetails }),
		...(applicationDetails.subSectorName && { subSectorName: applicationDetails.subSectorName }),
		...(applicationDetails?.geographicalInformation?.mapZoomLevelName && {
			mapZoomLevelName: applicationDetails?.geographicalInformation?.mapZoomLevelName
		}),
		...(!isEmpty(formattedApplicantDetails) && { applicant: formattedApplicantDetails }),
		...(!isEmpty(formattedApplicantAddressDetails) && {
			applicantAddress: formattedApplicantAddressDetails
		})
	};
};

/**
 * @type {import('express').RequestHandler}
 */
export const createApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const application = await caseRepository.createApplication(mappedApplicationDetails);

	response.send({ id: application.id });
};

/**
 * @type {import('express').RequestHandler}
 */
export const updateApplication = async (request, response) => {
	const mappedApplicationDetails = mapCreateApplicationRequestToRepository(request.body);

	const application = await caseRepository.updateApplication({
		caseId: request.params.id,
		applicantId: request.body.applicant?.id,
		...mappedApplicationDetails
	});

	response.send({ id: application.id });
};
