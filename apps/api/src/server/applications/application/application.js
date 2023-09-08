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
 * @property {Date | null} [dateProjectAppearsOnWebsite] Date Project Appears On Website
 * @property {Date | null} [dateOfDCOAcceptance] Date Application is Formally Accepted by PINS
 * @property {Date | null} [anticipatedDateOfSubmission] Anticipated Submission Date Of Application
 * @property {string | null} [anticipatedSubmissionDateNonSpecific] Approximate Anticipated Submission Date Of Application, e.g. Q3 2023
 * @property {Date | null} [dateOfDCOSubmission] Date Applcation is submitted
 * @property {Date | null} [dateOfRepresentationPeriodOpen] Date at which point publish can submit relevant reps
 * @property {Date | null} [dateOfRelevantRepresentationClose] Date at which point publish can no longer submit relevant reps
 * @property {Date | null} [dateRRepAppearOnWebsite] Date at which relevant reps appear on the website
 * @property {Date | null} [confirmedStartOfExamination] ConfirmedStartOfExamination by panel
 * @property {Date | null} [dateTimeExaminationEnds] ConfirmedSEndOfExamination by panel
 * @property {Date | null} [stage4ExtensionToExamCloseDate] Examination Period extended to this date
 * @property {Date | null} [stage5ExtensionToRecommendationDeadline] Recommendation period extended to this date
 * @property {Date | null} [dateOfRecommendations] Date recomm report sent to SoS
 * @property {Date | null} [confirmedDateOfDecision] Decision by SoS
 * @property {Date | null} [stage5ExtensionToDecisionDeadline] Decision period extended to this date
 * @property {Date | null} [dateProjectWithdrawn] DateProjectWithdrawn by applicant
 * @property {Date | null} [section46Notification] Applicant must notify PINS of statutory consultation
 * @property {Date | null} [datePINSFirstNotifiedOfProject] Date at which applicant notify PINS of a project (pre-publishing)
 * @property {Date | null} [screeningOpinionSought] (TBC by Env. Services Team)
 * @property {Date | null} [screeningOpinionIssued] (TBC by Env. Services Team)
 * @property {Date | null} [scopingOpinionSought] (TBC by Env. Services Team)
 * @property {Date | null} [scopingOpinionIssued] (TBC by Env. Services Team)
 * @property {Date | null} [deadlineForAcceptanceDecision] DeadlineForAcceptanceDecision
 * @property {Date | null} [dateSection58NoticeReceived] Applicant has notified all parties of application
 * @property {Date | null} [preliminaryMeetingStartDate] Meeting between all parties inc public
 * @property {Date | null} [deadlineForCloseOfExamination] DeadlineForCloseOfExamination
 * @property {Date | null} [deadlineForSubmissionOfRecommendation] DeadlineForSubmissionOfRecommendation
 * @property {Date | null} [deadlineForDecision] DeadlineForDecision
 * @property {Date | null} [jRPeriodEndDate] Judicial Review
 * @property {Date | null} [extensionToDateRelevantRepresentationsClose] ExtensionToDateRelevantRepresentationsClose
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
import { allKeyDateNames } from '../key-dates/key-dates.utils.js';

const sourceSystem = 'ODT';

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
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

// These two key dates have different names internally, as they were named before the PDM was defined
const keyDateNames = allKeyDateNames.filter(
	(name) => name !== 'submissionAtInternal' && name !== 'submissionAtPublished'
);

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
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
		anticipatedSubmissionDateNonSpecific: appDetails.submissionAtPublished,
		...pick(appDetails, keyDateNames)
	};
};

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
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
