import { mapValues, pick } from 'lodash-es';
import { allKeyDateNames } from '../../applications/key-dates/key-dates.utils.js';
import { databaseConnector } from '#utils/database-connector.js';
import { buildUpsertForEntity } from './sql-tools.js';
import {
	getMapZoomLevelIdFromDisplayName,
	getRegionIdsFromNames,
	getSubSectorIdFromReference
} from './utils.js';
import * as caseRepository from '#repositories/case.repository.js';
import { EventType } from '@pins/event-client';
import { broadcastNsipProjectEvent } from '#infrastructure/event-broadcasters.js';
import logger from '#utils/logger.js';

const keyDateNames = allKeyDateNames.filter(
	(name) =>
		name !== 'anticipatedDateOfSubmission' && name !== 'anticipatedSubmissionDateNonSpecific'
);

/**
 *
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('pins-data-model').Schemas.NSIPProject[]} models
 */
export const migrateNsipProjects = async (models) => {
	logger.info(`Migrating ${models.length} models`);

	for (const model of models) {
		await migrateCase(model);
		await migrateApplicationDetails(model);
		await migrateRegions(model);
		await invalidateCaseStatuses(model);
		await migrateCaseStatus(model);
		await migrateCasePublishedState(model);
		await migrateGridReference(model);
		// TODO: Case Involvement
		// TODO: Decision
		// TODO: SecretaryOfState

		const nsipProject = await caseRepository.getById(model.caseId, {
			subSector: true,
			sector: true,
			applicationDetails: true,
			zoomLevel: true,
			regions: true,
			caseStatus: true,
			casePublishedState: true,
			applicant: true,
			gridReference: true
		});

		if (!nsipProject) {
			throw Error(`Case not created for ID ${model.caseId}`);
		}

		const eventType = model.publishStatus === 'published' ? EventType.Publish : EventType.Update;

		if (model.migrationStatus) {
			logger.info(`Broadcasting event for case ${model.caseId}`);
			await broadcastNsipProjectEvent(nsipProject, eventType);
		}
	}
};

/**
 *
 * @param {import('pins-data-model').Schemas.NSIPProject} m
 */
const migrateCase = ({
	caseId,
	caseReference,
	projectName,
	projectNameWelsh,
	projectDescription,
	projectDescriptionWelsh,
	migrationStatus
}) => {
	const entity = {
		id: caseId,
		reference: caseReference,
		title: projectName,
		titleWelsh: projectNameWelsh,
		description: projectDescription,
		descriptionWelsh: projectDescriptionWelsh,
		migrationStatus
	};

	const { statement, parameters } = buildUpsertForEntity('Case', entity, 'id');

	return databaseConnector.$transaction([
		databaseConnector.$executeRawUnsafe(statement, ...parameters)
	]);
};

/**
 *
 * @param {import('pins-data-model').Schemas.NSIPProject} model
 */
const migrateApplicationDetails = async (model) => {
	// @ts-ignore
	const zoomLevelId = await getMapZoomLevelIdFromDisplayName(model.mapZoomLevel);

	if (!model.caseReference) {
		throw Error(`Can't migrate case ${model.caseId} without a caseReference`);
	}
	// Retrieve subSectorId from caseReference
	// @ts-ignore
	const subSectorId = await getSubSectorIdFromReference(model.caseReference);

	const entity = {
		id: model.caseId,
		caseId: model.caseId,
		subSectorId,
		zoomLevelId,
		locationDescription: model.projectLocation,
		locationDescriptionWelsh: model.projectLocationWelsh,
		caseEmail: model.projectEmailAddress,
		// These two dates have different public-facing names
		submissionAtInternal: model.anticipatedDateOfSubmission
			? new Date(model.anticipatedDateOfSubmission)
			: null,
		submissionAtPublished: model.anticipatedSubmissionDateNonSpecific,
		...mapValues(pick(model, keyDateNames), (/** @type {string | null} */ dateString) =>
			dateString ? new Date(dateString) : null
		)
	};

	const { statement, parameters } = buildUpsertForEntity('ApplicationDetails', entity, 'id');

	return databaseConnector.$transaction([
		databaseConnector.$executeRawUnsafe(statement, ...parameters)
	]);
};

/**
 * Limitation: This won't remove records which existed in a previous run but no longer exist.
 *
 * @param {import('pins-data-model').Schemas.NSIPProject} m
 */
const migrateRegions = async ({ caseId, regions }) => {
	if (!regions) {
		throw Error(`Cant't migrate case ${caseId} without a regions`);
	}

	const regionIds = await getRegionIdsFromNames(regions);

	for (const regionId of regionIds) {
		await databaseConnector.regionsOnApplicationDetails.upsert({
			where: {
				applicationDetailsId_regionId: {
					applicationDetailsId: caseId,
					regionId
				}
			},
			update: {},
			create: {
				applicationDetailsId: caseId,
				regionId
			}
		});
	}
};

/**
 * create a new, valid CaseStatus record for the case.
 * the invalidateCaseStatuses fn should be called before this
 *
 * @param {import('pins-data-model').Schemas.NSIPProject} m
 */
const migrateCaseStatus = ({ caseId, stage }) => {
	// We can't really predict the ID here, but it's fine to have multiples - it will just appear as if the case transitioned from the same stage and the end result is the same
	// - as long as all prev statuses have been invalidated
	return databaseConnector.caseStatus.create({
		data: {
			caseId,
			// @ts-ignore
			status: stage
		}
	});
};

/**
 * Invalidate all previous CaseStatus records for a case.
 * This should be called before the migrateCaseStatus call, to ensure only 1 valid record per case
 *
 * @param {import('pins-data-model').Schemas.NSIPProject} m
 */
const invalidateCaseStatuses = ({ caseId }) => {
	return databaseConnector.caseStatus.updateMany({
		where: { caseId },
		data: { valid: false }
	});
};

/**
 * Limitation: This won't remove records which existed in a previous run but no longer exist.
 *
 * We're losing history here, but we're fine to just have a single record for newly migrated cases. The date is technically incorrect but that's a fair trade-off.
 * @param {import('pins-data-model').Schemas.NSIPProject} m
 */
const migrateCasePublishedState = ({ caseId, publishStatus }) => {
	// We can't really predict the ID here, but it's fine to have multiples - it will just appear as if the case was published multiple times
	if (publishStatus === 'published') {
		return databaseConnector.casePublishedState.create({
			data: {
				caseId,
				isPublished: true,
				createdAt: new Date()
			}
		});
	}
};

/**
 * @param {import('pins-data-model').Schemas.NSIPProject} m
 */
const migrateGridReference = ({ caseId, easting, northing }) =>
	databaseConnector.gridReference.upsert({
		where: {
			caseId
		},
		update: {
			easting,
			northing
		},
		create: {
			caseId,
			easting,
			northing
		}
	});
