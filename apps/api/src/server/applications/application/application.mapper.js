import { isEmpty, pick } from 'lodash-es';
import { mapValuesUsingObject } from '#utils/mapping/map-values-using-object.js';

/**
 * @param {import("@pins/applications").CreateUpdateApplication} applicationDetails
 * @returns {import("../../repositories/case.repository").CommonCaseParams}
 */
export const mapApplicationDetailsToRepository = (applicationDetails) => {
	const formattedCaseDetails = pick(applicationDetails, [
		'title',
		'titleWelsh',
		'description',
		'descriptionWelsh'
	]);

	const formattedGridReferenceDetails = mapValuesUsingObject(
		pick(applicationDetails.geographicalInformation?.gridReference, ['easting', 'northing']),
		{ easting: Number, northing: Number }
	);

	const formattedApplicationDetails = pick(
		{
			...applicationDetails,
			...applicationDetails.geographicalInformation,
			...applicationDetails.keyDates?.preApplication,
			...applicationDetails.keyDates?.preExamination
		},
		[
			'locationDescription',
			'locationDescriptionWelsh',
			'submissionAtInternal',
			'submissionAtPublished',
			'caseEmail',
			'dateOfReOpenRelevantRepresentationStart',
			'dateOfReOpenRelevantRepresentationClose',
			'dcoStatus',
			// enums / strings
			'tier',
			'subProjectType',
			'newMaturity',
			'recommendation',
			'courtDecisionOutcome',
			'courtDecisionOutcomeText',
			's61SummaryURI',
			'programmeDocumentURI',
			'additionalComments',
			'issuesTracker',
			// document enums
			'principalAreaDisagreementSummaryStmt',
			'policyComplianceDocument',
			'designApproachDocument',
			'matureOutlineControlDocument',
			'caAndTpEvidence',
			'publicSectorEqualityDuty',
			'fastTrackAdmissionDocument',
			'multipartyApplicationCheckDocument',
			// numbers / booleans
			'numberBand2Inspectors',
			'numberBand3Inspectors',
			'essentialFastTrackComponents',
			'planProcessEvidence'
		]
	);

	if (formattedApplicationDetails.caseEmail === '') {
		// Make sure caseEmail is saved as a null if blank
		formattedApplicationDetails.caseEmail = null;
	}

	if (formattedApplicationDetails.dcoStatus === '') {
		formattedApplicationDetails.dcoStatus = null;
	}

	if (formattedApplicationDetails.planProcessEvidence != null) {
		formattedApplicationDetails.planProcessEvidence = Boolean(
			formattedApplicationDetails.planProcessEvidence
		);
	}

	if (formattedApplicationDetails.essentialFastTrackComponents != null) {
		formattedApplicationDetails.essentialFastTrackComponents = Boolean(
			formattedApplicationDetails.essentialFastTrackComponents
		);
	}

	if (formattedApplicationDetails.numberBand2Inspectors === '') {
		formattedApplicationDetails.numberBand2Inspectors = null;
	} else if (formattedApplicationDetails.numberBand2Inspectors != null) {
		formattedApplicationDetails.numberBand2Inspectors = Number(
			formattedApplicationDetails.numberBand2Inspectors
		);
	}

	if (formattedApplicationDetails.numberBand3Inspectors === '') {
		formattedApplicationDetails.numberBand3Inspectors = null;
	} else if (formattedApplicationDetails.numberBand3Inspectors != null) {
		formattedApplicationDetails.numberBand3Inspectors = Number(
			formattedApplicationDetails.numberBand3Inspectors
		);
	}

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
		'country',
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
		...(applicationDetails.stage && { caseStatus: { status: applicationDetails.stage } }),
		...(typeof applicationDetails.isMaterialChange !== 'undefined'
			? { isMaterialChange: applicationDetails.isMaterialChange }
			: {})
	};
};

/**
 * @param {number} caseId
 * @param {import("@pins/applications").CreateUpdateApplication} applicationDetails
 * @returns {import("../../repositories/case.repository").UpdateApplicationParams}
 * */
export const mapUpdateRequestToRepository = (caseId, applicationDetails) => ({
	...mapApplicationDetailsToRepository(applicationDetails),
	caseId,
	applicantId: applicationDetails?.applicant?.id
});
