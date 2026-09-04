import { pick } from 'lodash-es';
import { allKeyDateNames } from '../../applications/key-dates/key-dates.utils.js';
import { sourceSystem } from './constants.js';
import { mapKeyDatesToISOStrings } from '#utils/mapping/map-key-dates.js';

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 *
 * @returns {import('@planning-inspectorate/data-model').Schemas.NSIPProject} NSIPProject
 */
export const buildNsipProjectPayload = (projectEntity) => {
	const application = mapApplicationDetails(projectEntity);
	const sectorAndType = mapSectorAndType(projectEntity);
	const projectTeam = mapProjectTeam(projectEntity);
	const meetings = mapMeetings(projectEntity);
	const invoices = mapInvoices(projectEntity);

	// @ts-ignore
	return {
		caseId: projectEntity.id,
		caseReference: projectEntity.reference,
		projectName: projectEntity.title,
		projectNameWelsh: projectEntity.titleWelsh,
		projectDescription: projectEntity.description,
		projectDescriptionWelsh: projectEntity.descriptionWelsh,
		publishStatus: projectEntity.CasePublishedState?.[0]?.isPublished ? 'published' : 'unpublished',
		sourceSystem,
		isMaterialChange: projectEntity.isMaterialChange,
		...application,
		...sectorAndType,
		applicantId: projectEntity.applicantId?.toString() ?? null,
		...projectTeam,
		meetings: meetings,
		invoices: invoices,

		// null value fields added for schema validation
		migrationStatus: null
	};
};

// These three key dates have different names internally, as they were named before the PDM was defined
const keyDateNames = allKeyDateNames.filter(
	(name) =>
		![
			'submissionAtInternal',
			'submissionAtPublished',
			'notificationDateForEventsApplicant'
		].includes(name)
);

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 * @returns {import('@planning-inspectorate/data-model').Schemas.NSIPProject | undefined}
 */
const mapApplicationDetails = (projectEntity) => {
	const appDetails = projectEntity?.ApplicationDetails;
	const stage = projectEntity?.CaseStatus?.[0]?.status ?? 'draft';
	const mapZoomLevel = appDetails.zoomLevel?.name ?? 'none';
	const regions = appDetails.regions?.map((r) => r.region.name) ?? [];
	const { easting = null, northing = null } = projectEntity?.gridReference ?? {};

	const keyDates = projectEntity?.ApplicationDetails
		? mapKeyDatesToISOStrings(projectEntity?.ApplicationDetails)
		: {};

	const isWelshLanguage = Boolean(
		projectEntity?.titleWelsh ||
		projectEntity?.descriptionWelsh ||
		appDetails?.locationDescriptionWelsh
	);

	return {
		stage,
		projectLocation: appDetails?.locationDescription,
		projectLocationWelsh: appDetails?.locationDescriptionWelsh,
		projectEmailAddress: appDetails?.caseEmail,
		regions,
		easting,
		northing,
		welshLanguage: isWelshLanguage,
		mapZoomLevel,
		secretaryOfState: null,
		...pick(keyDates, keyDateNames),
		anticipatedDateOfSubmission: appDetails.submissionAtInternal?.toISOString() ?? null,
		anticipatedSubmissionDateNonSpecific: appDetails.submissionAtPublished ?? null,
		notificationDateForEventsDeveloper:
			appDetails.notificationDateForEventsApplicant?.toISOString() ?? null,
		transboundary: null,
		tier: appDetails?.tier,
		subProjectType: appDetails?.subProjectType,
		newMaturity: appDetails?.newMaturity,
		recommendation: appDetails?.recommendation,
		courtDecisionOutcome: appDetails?.courtDecisionOutcome,
		courtDecisionOutcomeText: appDetails?.courtDecisionOutcomeText,
		s61SummaryURI: appDetails?.s61SummaryURI,
		programmeDocumentURI: appDetails?.programmeDocumentURI,
		additionalComments: appDetails?.additionalComments,
		issuesTracker: appDetails?.issuesTracker,
		principalAreaDisagreementSummaryStmt: appDetails?.principalAreaDisagreementSummaryStmt,
		policyComplianceDocument: appDetails?.policyComplianceDocument,
		designApproachDocument: appDetails?.designApproachDocument,
		matureOutlineControlDocument: appDetails?.matureOutlineControlDocument,
		caAndTpEvidence: appDetails?.caAndTpEvidence,
		publicSectorEqualityDuty: appDetails?.publicSectorEqualityDuty,
		fastTrackAdmissionDocument: appDetails?.fastTrackAdmissionDocument,
		multipartyApplicationCheckDocument: appDetails?.multipartyApplicationCheckDocument,
		numberBand2Inspectors: appDetails?.numberBand2Inspectors,
		numberBand3Inspectors: appDetails?.numberBand3Inspectors,
		essentialFastTrackComponents: appDetails?.essentialFastTrackComponents,
		planProcessEvidence: appDetails?.planProcessEvidence,
		decision: null,
		estimatedPrelimMeetingDate: appDetails?.estimatedPrelimMeetingDate?.toISOString() ?? null
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

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 * @returns { {
 * operationsLeadId: string | null,
 * operationsLeadIds: string[],
 * operationsManagerId: string | null,
 * operationsManagerIds: string[],
 * caseManagerId: string | null,
 * caseManagerIds: string[],
 * nsipOfficerIds: string[],
 * nsipAdministrationOfficerIds: string[],
 * leadInspectorId: string | null,
 * leadInspectorIds: string[],
 * inspectorIds: string[],
 * environmentalServicesOfficerId: string | null,
 * environmentalServicesOfficerIds: string[],
 * legalOfficerId: string | null,
 * legalOfficerIds: string[]
 * } }
 */
const mapProjectTeam = (projectEntity) => {
	const projectTeam = projectEntity?.ProjectTeam;

	// Currently sends both singular and arrays of role type IDs
	// while the data-model schema requires the singular field.
	// Once CBOS and ODW are using the new array field the
	// singular field can be safely removed
	const teamMembers = {
		operationsLeadId: null,
		operationsLeadIds: [],
		operationsManagerId: null,
		operationsManagerIds: [],
		caseManagerId: null,
		caseManagerIds: [],
		nsipOfficerIds: [],
		nsipAdministrationOfficerIds: [],
		leadInspectorId: null,
		leadInspectorIds: [],
		inspectorIds: [],
		environmentalServicesOfficerId: null,
		environmentalServicesOfficerIds: [],
		legalOfficerId: null,
		legalOfficerIds: []
	};

	if (projectTeam) {
		projectTeam.forEach((member) => {
			switch (member.role) {
				case 'operations_lead':
					if (teamMembers.operationsLeadId === null) {
						teamMembers.operationsLeadId = member.userId;
					}
					teamMembers.operationsLeadIds.push(member.userId);
					break;

				case 'operations_manager':
					if (teamMembers.operationsManagerId === null) {
						teamMembers.operationsManagerId = member.userId;
					}
					teamMembers.operationsManagerIds.push(member.userId);
					break;

				case 'case_manager':
					if (teamMembers.caseManagerId === null) {
						teamMembers.caseManagerId = member.userId;
					}
					teamMembers.caseManagerIds.push(member.userId);
					break;

				case 'NSIP_officer':
					teamMembers.nsipOfficerIds.push(member.userId);
					break;

				case 'NSIP_administration_officer':
					teamMembers.nsipAdministrationOfficerIds.push(member.userId);
					break;

				case 'lead_inspector':
					if (teamMembers.leadInspectorId === null) {
						teamMembers.leadInspectorId = member.userId;
					}
					teamMembers.leadInspectorIds.push(member.userId);
					break;

				case 'inspector':
					teamMembers.inspectorIds.push(member.userId);
					break;

				case 'environmental_services':
					if (teamMembers.environmentalServicesOfficerId === null) {
						teamMembers.environmentalServicesOfficerId = member.userId;
					}
					teamMembers.environmentalServicesOfficerIds.push(member.userId);
					break;

				case 'legal_officer':
					if (teamMembers.legalOfficerId === null) {
						teamMembers.legalOfficerId = member.userId;
					}
					teamMembers.legalOfficerIds.push(member.userId);
					break;
			}
		});
	}

	return teamMembers;
};

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 * @returns {Array<{ meetingId: number, meetingAgenda: string|null, planningInspectorateRole: string|null, meetingDate: string|null, meetingType: string|null }>}
 */
const mapMeetings = (projectEntity) => {
	const meetings = projectEntity?.meeting || [];
	return meetings.map((meeting) => {
		return {
			meetingId: meeting.id,
			meetingAgenda: meeting.agenda ?? null,
			planningInspectorateRole: meeting?.pinsRole ?? null,
			meetingDate: meeting.meetingDate?.toISOString() ?? null,
			meetingType: meeting.meetingType ?? null
		};
	});
};

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 * @returns {Array<{ invoiceStage: string, invoiceNumber: string, amountDue: number|null, paymentDueDate: string|null, invoicedDate: string|null, paymentDate: string|null, refundCreditNoteNumber: string|null, refundAmount: number|null, refundIssueDate: string|null }>}
 */
const mapInvoices = (projectEntity) => {
	const invoices = projectEntity?.invoice || [];
	return invoices.map((invoice) => {
		return {
			invoiceStage: invoice.invoiceStage,
			invoiceNumber: invoice.invoiceNumber,
			amountDue: invoice?.amountDue != null ? Number(invoice.amountDue) : null,
			paymentDueDate: invoice?.paymentDueDate?.toISOString() ?? null,
			invoicedDate: invoice?.invoicedDate?.toISOString() ?? null,
			paymentDate: invoice?.paymentDate?.toISOString() ?? null,
			refundCreditNoteNumber: invoice?.refundCreditNoteNumber ?? null,
			refundAmount: invoice?.refundAmount != null ? Number(invoice.refundAmount) : null,
			refundIssueDate: invoice?.refundIssueDate?.toISOString() ?? null
		};
	});
};
