import { pick } from 'lodash-es';
import { allKeyDateNames } from '../../applications/key-dates/key-dates.utils.js';
import { sourceSystem } from './constants.js';

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
		caseReference: projectEntity.reference ?? undefined,
		projectName: projectEntity.title ?? undefined,
		projectDescription: projectEntity.description ?? undefined,
		publishStatus: projectEntity.CasePublishedState?.[0]?.isPublished ? 'published' : 'unpublished',
		sourceSystem,
		...application,
		...sectorAndType,
		applicantId: projectEntity.applicant?.id?.toString(),
		...projectTeam
	};
};

// These two key dates have different names internally, as they were named before the PDM was defined
const keyDateNames = allKeyDateNames.filter(
	(name) => name !== 'submissionAtInternal' && name !== 'submissionAtPublished'
);

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 * @returns {import('pins-data-model').Schemas.NSIPProject | undefined}
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
 * legalOfficerId: number | null } | {
 * nsipOfficerIds: number[],
 * nsipAdministrationOfficerIds: number[],
 * inspectorIds: number[],
 * }}
 */
const mapProjectTeam = (projectEntity) => {
	const projectTeam = projectEntity?.ProjectTeam;

	if (!projectTeam) {
		return {
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			inspectorIds: []
		};
	}

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

	return teamMembers;
};
