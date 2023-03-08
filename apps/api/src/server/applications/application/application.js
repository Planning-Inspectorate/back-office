/**
 * Subset of Pins Data Model [Case]
 *
 * @typedef {object} NsipProjectPayload
 * @property {number} caseId The unique identifier within the Back Office. This is not the same as the case reference
 * @property {string | null} [caseReference]
 * @property {string | null} [projectName] Name of project
 * @property {string | null} [projectDescription]
 * @property {"published"|"unpublished"} [publishStatus]
 * @property {string | null} [sector] {Sector Abbreviation} - {Sector Display Name}
 * @property {string | null} [projectType] {SubSector Abbreviation} - {SubSector Display Name}
 * @property {"ODT"|"Horizon"} sourceSystem
 * @property {"draft"|"pre_application"|"acceptance"|"pre_examination"|"examination"|"recommendation"|"decision"|"post_decision"|"withdrawn"} [stage] Process stage identifier
 * @property {string | null} [projectLocation] Description of site location
 * @property {string | null} [projectEmailAddress] PINS Project email address pubished on website
 * @property {string[]} [regions]
 * @property {boolean} [transboundary] Drives addition of Transboundary tab on website. [TODO]
 * @property {number} [easting] Project site Easting co-ordinate.
 * @property {number} [northing] Project site Northing co-ordinate.
 * @property {boolean} [welshLanguage] Welsh Language translation required.
 * @property {string | null} [mapZoomLevel] Resolution of pinned map. Set when co-ordinates are created.
 * @property {string | null} [secretaryOfState] Relevant Government Department. [TODO]
 * @property {string | null} [dateProjectAppearsOnWebsite] Date Project Appears On Website
 * @property {string | null} [dateOfDCOAcceptance] Date Application is Formerly Accepted by PINS
 * @property {Date | null} [anticipatedDateOfSubmission] Anticipated Submission Date Of Application
 * @property {string | null} [anticipatedSubmissionDateNonSpecific] Approximate Anticipated Submission Date Of Application, e.g. Q3 2023
 * @property {string | null} [dateOfDCOSubmission] Date Applcation is submitted
 * @property {string | null} [dateOfRepresentationPeriodOpen] Date at which point publish can submit relevant reps
 * @property {string | null} [dateOfRelevantRepresentationClose] Date at which point publish can no longer submit relevant reps
 * @property {string | null} [dateRRepAppearOnWebsite] Date at which relevant reps appear on the website
 * @property {string | null} [confirmedStartOfExamination] ConfirmedStartOfExamination by panel
 * @property {string | null} [dateTimeExaminationEnds] ConfirmedSEndOfExamination by panel
 * @property {string | null} [stage4ExtensionToExamCloseDate] Examination Period extended to this date
 * @property {string | null} [stage5ExtensionToRecommendationDeadline] Recommendation period extended to this date
 * @property {string | null} [dateOfRecommendations] Date recomm report sent to SoS
 * @property {string | null} [confirmedDateOfDecision] Decision by SoS
 * @property {string | null} [stage5ExtensionToDecisionDeadline] Decision period extended to this date
 * @property {string | null} [dateProjectWithdrawn] DateProjectWithdrawn by applicant
 * @property {string | null} [section46Notification] Applicant must notify PINS of statutory consultation
 * @property {string | null} [datePINSFirstNotifiedOfProject] Date at which applicant notify PINS of a project (pre-publishing)
 * @property {string | null} [screeningOpinionSought] (TBC by Env. Services Team)
 * @property {string | null} [screeningOpinionIssued] (TBC by Env. Services Team)
 * @property {string | null} [scopingOpinionSought] (TBC by Env. Services Team)
 * @property {string | null} [scopingOpinionIssued] (TBC by Env. Services Team)
 * @property {string | null} [deadlineForAcceptanceDecision] DeadlineForAcceptanceDecision
 * @property {string | null} [dateSection58NoticeReceived] Applicant has notified all parties of application
 * @property {string | null} [preliminaryMeetingStartDate] Meeting between all parties inc public
 * @property {string | null} [deadlineForCloseOfExamination] DeadlineForCloseOfExamination
 * @property {string | null} [deadlineForSubmissionOfRecommendation] DeadlineForSubmissionOfRecommendation
 * @property {string | null} [deadlineForDecision] DeadlineForDecision
 * @property {string | null} [jRPeriodEndDate] Judicial Review
 * @property {string | null} [extensionToDateRelevantRepresentationsClose] ExtensionToDateRelevantRepresentationsClose
 * @property {string | null} [operationsLeadId] Maps to [Employee].[EmployeeID].
 * @property {string | null} [operationsManagerId] New NSIP role, Maps to [Employee].[EmployeeID]
 * @property {string | null} [caseManagerId] Maps to [Employee].[EmployeeID]
 * @property {string[]} [nsipOfficerIds]
 * @property {string[]} [nsipAdministrationOfficerIds]
 * @property {string | null} [leadInspectorId] Maps to [Employee].[EmployeeID]
 * @property {string[]} [inspectorIds]
 * @property {string | null} [environmentalServicesOfficerId] Maps to [Employee].[EmployeeID]
 * @property {string | null} [legalOfficerId] Maps to [Employee].[EmployeeID]
 * @property {string[]} [applicantIds] Maps to [Service Customer].[CustomerID]
 * @property {string[]} [interestedPartyIds]
 */

import { pick } from 'lodash-es';

const sourceSystem = 'ODT';

/**
 * @param {import('@pins/api').Schema.Case} projectEntity
 * @returns {NsipProjectPayload}
 */
export const buildNsipProjectPayload = (projectEntity) => {
	const application = mapApplicationDetails(projectEntity);

	const sectorAndType = mapSectorAndType(projectEntity);

	const applicantIds =
		projectEntity?.serviceCustomer?.map((customer) => customer.id.toString()) || [];

	// 3. Return the result
	return {
		caseId: projectEntity.id,
		caseReference: projectEntity.reference,
		projectName: projectEntity.title,
		projectDescription: projectEntity.description,
		publishStatus: projectEntity.publishedAt ? 'published' : 'unpublished',
		sourceSystem,
		...application,
		...sectorAndType,
		applicantIds,
		// TODO: Will be added with Case Involvement work
		nsipOfficerIds: [],
		nsipAdministrationOfficerIds: [],
		inspectorIds: [],
		// TODO: Will be added with work being conducted by FO on Representations
		interestedPartyIds: []
	};
};

/**
 * @param {import('@pins/api').Schema.Case} projectEntity
 * @returns {NsipProjectPayload | undefined}
 */
const mapApplicationDetails = (projectEntity) => {
	const appDetails = projectEntity?.ApplicationDetails;

	if (!appDetails) {
		return;
	}

	const stage = projectEntity?.CaseStatus?.[0]?.status;

	const mapZoomLevel = appDetails.zoomLevel?.name;

	const regions = appDetails.regions?.map((r) => r.region.name) || [];

	const gridReference =
		projectEntity?.gridReference && pick(projectEntity?.gridReference, ['easting', 'northing']);

	// @ts-ignore
	return {
		stage,
		projectLocation: appDetails?.locationDescription,
		projectEmailAddress: appDetails?.caseEmail,
		regions,
		// TODO: transboundary
		...gridReference,
		// For MVP we're not supporting Welsh Language
		welshLanguage: false,
		mapZoomLevel,
		// TODO: secretaryOfState
		anticipatedDateOfSubmission: appDetails.submissionAtInternal,
		anticipatedSubmissionDateNonSpecific: appDetails.submissionAtPublished
	};
};

/**
 * @param {import('@pins/api').Schema.Case} projectEntity
 * @returns { { sector: string, projectType: string } | undefined}
 */
const mapSectorAndType = (projectEntity) => {
	const subSector = projectEntity?.ApplicationDetails?.subSector;

	if (!subSector?.sector) {
		return;
	}

	const { abbreviation: sectorAbbreviation, displayNameEn: sectorName } = pick(subSector.sector, [
		'abbreviation',
		'displayNameEn'
	]);
	const { abbreviation: subSectorAbbreviation, displayNameEn: subSectorName } = pick(subSector, [
		'abbreviation',
		'displayNameEn'
	]);

	return {
		sector: `${sectorAbbreviation} - ${sectorName}`,
		projectType: `${subSectorAbbreviation} - ${subSectorName}`
	};
};
