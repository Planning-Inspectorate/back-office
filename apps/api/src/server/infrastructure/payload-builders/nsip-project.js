import { pick } from 'lodash-es';
import { allKeyDateNames } from '../../applications/key-dates/key-dates.utils.js';
import { sourceSystem } from './constants.js';
import { mapKeyDatesToISOStrings } from '#utils/mapping/map-key-dates.js';

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 *
 * @returns {import('pins-data-model').Schemas.NSIPProject} NSIPProject
 */
export const buildNsipProjectPayload = (projectEntity) => {
	const application = mapApplicationDetails(projectEntity);
	const sectorAndType = mapSectorAndType(projectEntity);
	const projectTeam = mapProjectTeam(projectEntity);

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
		...application,
		...sectorAndType,
		applicantId: projectEntity.applicantId?.toString() ?? null,
		...projectTeam,

		// null value fields added fo schema validation
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
 * @returns {import('pins-data-model').Schemas.NSIPProject | undefined}
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
		decision: null
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
 * operationsLeadId: number | null,
 * operationsManagerId: number | null,
 * caseManagerId: number | null,
 * nsipOfficerIds: number[],
 * nsipAdministrationOfficerIds: number[],
 * leadInspectorId: number | null,
 * inspectorIds: number[],
 * environmentalServicesOfficerId: number | null,
 * legalOfficerId: number | null } }
 */
const mapProjectTeam = (projectEntity) => {
	const projectTeam = projectEntity?.ProjectTeam;

	const teamMembers = {
		operationsLeadId: null,
		operationsManagerId: null,
		caseManagerId: null,
		nsipOfficerIds: [],
		nsipAdministrationOfficerIds: [],
		leadInspectorId: null,
		inspectorIds: [],
		environmentalServicesOfficerId: null,
		legalOfficerId: null
	};

	if (projectTeam) {
		projectTeam.forEach((member) => {
			switch (member.role) {
				case 'operations_lead':
					teamMembers.operationsLeadId = member.userId;
					break;
				case 'operations_manager':
					teamMembers.operationsManagerId = member.userId;
					break;
				case 'case_manager':
					teamMembers.caseManagerId = member.userId;
					break;
				case 'NSIP_officer':
					teamMembers.nsipOfficerIds.push(member.userId);
					break;
				case 'NSIP_administration_officer':
					teamMembers.nsipAdministrationOfficerIds.push(member.userId);
					break;
				case 'lead_inspector':
					teamMembers.leadInspectorId = member.userId;
					break;
				case 'inspector':
					teamMembers.inspectorIds.push(member.userId);
					break;
				case 'environmental_services':
					teamMembers.environmentalServicesOfficerId = member.userId;
					break;
				case 'legal_officer':
					teamMembers.legalOfficerId = member.userId;
					break;
			}
		});
	}

	return teamMembers;
};
