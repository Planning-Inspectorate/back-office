import { mapValues, pick } from 'lodash-es';
import { allKeyDateNames } from '../../applications/key-dates/key-dates.utils.js';
import { databaseConnector } from '#utils/database-connector.js';

const keyDateNames = allKeyDateNames.filter(
	(name) =>
		name !== 'anticipatedDateOfSubmission' && name !== 'anticipatedSubmissionDateNonSpecific'
);

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('../../applications/application/application.js').NsipProjectPayload[]} models
 */
export const migrateNsipProjects = async (models) => {
	console.info(`Migrating ${models.length} models`);

	for (const model of models) {
		const entity = await mapModelToEntity(model);

		// @ts-ignore
		await databaseConnector.case.create({ data: entity });
	}
};

/**
 *
 * @param {import('src/server/applications/application/application.js').NsipProjectPayload} m
 *
 * TODO: Service Customers can't be created because of how dependencies work right now
 * TODO: Case Team
 * TODO: Interested Parties
 *
 * Issue: Our currently model assumes that things like applicants and representations are only associated with a single case
 * The PINS Data Model assumes that they already exist, and that their IDs are associated with a case.
 *
 * Let's propose to change this so that they are stand-alone for MVP.
 *
 * @returns {Promise<import('@prisma/client').Case>} subSectorId
 */
const mapModelToEntity = async (m) => {
	if (!m.projectType) {
		throw Error(`Cant't migrate case ${m.caseReference} without a projectType`);
	}

	const subSectorId = await getSubSectorId(m.projectType);

	if (!m.mapZoomLevel) {
		throw Error(`Cant't migrate case ${m.caseReference} without a mapZoomLevel`);
	}

	const zoomLevelId = await getZoomLevelId(m.mapZoomLevel);

	if (!m.regions?.length) {
		throw Error(`Cant't migrate case ${m.caseReference} without at least one Region specified`);
	}

	const regionIds = await getRegionIds(m.regions);

	const caseEntity = {
		reference: m.caseReference,
		title: m.projectName,
		description: m.projectDescription,
		...(m.publishStatus === 'published' && {
			publishedAt: new Date() // TODO: We're going to lose this info
		}),
		ApplicationDetails: {
			create: {
				subSector: {
					connect: { id: subSectorId }
				},
				zoomLevel: {
					connect: { id: zoomLevelId }
				},
				regions: { create: regionIds.map((id) => ({ region: { connect: { id } } })) },
				locationDescription: m.projectLocation,
				caseEmail: m.projectEmailAddress,
				// These two dates have different public-facing names
				submissionAtInternal: m.anticipatedDateOfSubmission
					? new Date(m.anticipatedDateOfSubmission)
					: null,
				submissionAtPublished: m.anticipatedSubmissionDateNonSpecific,
				...mapValues(pick(m, keyDateNames), (/** @type {string | null} */ dateString) =>
					dateString ? new Date(dateString) : null
				)
			}
		},
		CaseStatus: {
			create: { status: m.stage }
		},
		// serviceCustomer: TODO
		// case team: TODO
		// interested
		gridReference: {
			create: {
				...pick(m, ['easting', 'northing'])
			}
		}
	};

	// @ts-ignore
	return caseEntity;
};

/**
 *
 * @param {string} projectType
 *
 * @returns {Promise<number>} subSectorId
 */
const getSubSectorId = async (projectType) => {
	const abbreviation = projectType.split('-')[0]?.trim();

	if (!abbreviation) {
		throw Error(`Unable to determine sub sector for project type ${projectType}`);
	}

	const subSector = await databaseConnector.subSector.findUnique({
		where: {
			abbreviation
		}
	});

	if (!subSector) {
		throw Error(`No subsector found for abbreviation ${abbreviation}`);
	}

	return subSector.id;
};

/**
 *
 * @param {string} name
 *
 * @returns {Promise<number>} subSectorId
 */
const getZoomLevelId = async (name) => {
	const zoomLevel = await databaseConnector.zoomLevel.findUnique({
		where: {
			name
		}
	});

	if (!zoomLevel) {
		throw Error(`No zoomLevel found for name ${name}`);
	}

	return zoomLevel.id;
};

/**
 *
 * @param {string[]} regionNames
 *
 * @returns {Promise<number[]>} regionIds
 */
const getRegionIds = async (regionNames) => {
	const regions = await databaseConnector.region.findMany();

	return regionNames.map((name) => {
		const region = regions.find((r) => r.name === name);

		if (!region) {
			throw Error(`Could not find region ${name}`);
		}

		return region.id;
	});
};
