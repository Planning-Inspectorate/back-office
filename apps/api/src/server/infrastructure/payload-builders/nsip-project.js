import { pick } from 'lodash-es';
import { allKeyDateNames } from '../../applications/key-dates/key-dates.utils.js';
import { sourceSystem } from './constants.js';

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 *
 * @returns {import('../../../message-schemas/events/nsip-project.d.ts').NSIPProject} NSIPProject
 */
export const buildNsipProjectPayload = (projectEntity) => {
	const application = mapApplicationDetails(projectEntity);

	const sectorAndType = mapSectorAndType(projectEntity);

	// 3. Return the result
	return {
		caseId: projectEntity.id,
		caseReference: projectEntity.reference,
		projectName: projectEntity.title,
		projectDescription: projectEntity.description,
		publishStatus: projectEntity.CasePublishedState?.[0]?.isPublished ? 'published' : 'unpublished',
		sourceSystem,
		...application,
		...sectorAndType,
		applicantId: projectEntity.applicant?.id?.toString(),
		// TODO: Will be added with Case Involvement work
		nsipOfficerIds: [],
		nsipAdministrationOfficerIds: [],
		inspectorIds: []
	};
};

// These two key dates have different names internally, as they were named before the PDM was defined
const keyDateNames = allKeyDateNames.filter(
	(name) => name !== 'submissionAtInternal' && name !== 'submissionAtPublished'
);

/**
 * @param {import('@pins/applications.api').Schema.Case} projectEntity
 * @returns {import('../../../message-schemas/events/nsip-project.d.ts').NSIPProject | undefined}
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
