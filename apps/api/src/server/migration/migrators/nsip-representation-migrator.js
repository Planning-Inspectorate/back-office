import { getCaseIdFromRef } from './utils.js';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { databaseConnector } from '#utils/database-connector.js';
import { omit } from 'lodash-es';
import * as documentRepository from '#repositories/document.repository.js';
import * as representationAttachmentRepository from '#repositories/representation.repository.js';
import { broadcastNsipRepresentationEvent } from '#infrastructure/event-broadcasters.js';
import { representationsStatusesList } from '../../applications/application/representations/representation.validators.js';
import { EventType } from '@pins/event-client';
import { createDocumentVersion } from './nsip-document-migrator.js';
import { broadcastNsipDocumentEvent } from '#infrastructure/event-broadcasters.js';

/**
 * @typedef {import("pins-data-model").Schemas.Representation} RepresentationModel
 * @param {RepresentationModel[]} representations
 */
export const migrateRepresentations = async (representations) => {
	console.info(`Migrating ${representations.length} Representations`);

	for (const representation of representations) {
		const representationEntity = await mapModelToRepresentationEntity(representation);

		if (representationEntity.id >= MigratedEntityIdCeiling) {
			throw Error(
				`Unable to migrate entity id=${representationEntity.id} - identity above threshold`
			);
		}

		const { statement: representationStatement, parameters: representationParameters } =
			buildUpsertForEntity('Representation', representationEntity, 'id');

		console.info(`Upserting Representation with ID ${representationEntity.id}`);

		await databaseConnector.$transaction([
			databaseConnector.$executeRawUnsafe(representationStatement, ...representationParameters)
		]);

		if (representationEntity.status === 'PUBLISHED') {
			console.info('Broadcasting event for representation');
			await broadcastNsipRepresentationEvent(representationEntity, EventType.Publish);
		}

		if (representationEntity.redacted) {
			console.info(
				`Upserting RepresentationAction for Representation with ID ${representationEntity.id}`
			);

			const redaction = mapRepresentationRedactionAction(representation);
			const existingCount = await databaseConnector.representationAction.count({
				where: omit(redaction, 'notes')
			});
			if (existingCount === 0) {
				await databaseConnector.representationAction.create({ data: redaction });
			}
		}
		const representationAttachmentDetails = [];
		await Promise.all(
			representation.attachmentIds.map(async (attachmentId) => {
				return documentRepository.getById(attachmentId).then((documentRow) => {
					if (!documentRow || !documentRow.guid) {
						throw Error(`Failed to get document with ID ${attachmentId}`);
					}
					representationAttachmentDetails.push({
						docGuid: documentRow.guid,
						representationStatus: representation.status,
						latestVersionId: documentRow.latestVersionId
					});

					return representationAttachmentRepository.upsertApplicationRepresentationAttachment(
						representationEntity.id,
						documentRow.guid
					);
				});
			})
		);
		await handleDocumentVersionUpdateForRepresentationAttachments(representationAttachmentDetails);
	}
};

/**
 * We need to mark documents as published where the representation is published - Horizon is not doing this, so we will handle it here
 * @param {object} attachmentDetails
 * @returns {Promise<void>}
 */
const handleDocumentVersionUpdateForRepresentationAttachments = async (attachmentDetails) => {
	for await (const attachmentDetail of attachmentDetails) {
		const docVersions = await databaseConnector.documentVersion.findMany({
			where: {
				documentGuid: attachmentDetail.docGuid
			}
		});
		let latestPublishedVersion;
		for await (let docVersion of docVersions) {
			docVersion.stage = '0';
			if (attachmentDetail.latestVersionId === docVersion.version && attachmentDetail.representationStatus === 'published') {
				docVersion.publishedStatus = 'published'
				latestPublishedVersion = docVersion;
			}
			const documentForServiceBus = await createDocumentVersion(docVersion);
			if (latestPublishedVersion) {
				console.log(
					`Broadcasting latest representation attachment guid:${latestPublishedVersion.documentGuid} and version: ${latestPublishedVersion.version}`
				);
				await broadcastNsipDocumentEvent(documentForServiceBus, EventType.Update, {
					publishing: 'true',
					migrationPublishing: 'true'
				});
			}
		}
	}
};

/**
 * @typedef {import("apps/api/src/database/schema.d.ts").Representation} Representation
 * @param {RepresentationModel} representation
 * @returns {Representation}
 */
const mapModelToRepresentationEntity = async ({
	representationId,
	referenceId,
	caseRef,
	status,
	originalRepresentation,
	redacted,
	redactedRepresentation,
	representationFrom,
	representedId,
	representativeId,
	representationType,
	dateReceived
}) => {
	const caseId = await getCaseIdFromRef(caseRef);

	return {
		id: representationId,
		reference: referenceId,
		caseId,
		status: mapToCbosStatus(status ?? ''),
		originalRepresentation,
		redactedRepresentation,
		redacted,
		received: new Date(dateReceived),
		type: representationType,
		unpublishedUpdates: false,
		representativeId: representativeId ? parseInt(representativeId) : null,
		representedId,
		representedType: representationFrom
	};
};

const mapRepresentationRedactionAction = ({
	representationId,
	redactedBy,
	redactedNotes,
	dateReceived
}) => ({
	representationId,
	type: 'REDACTION',
	actionBy: redactedBy || '',
	actionDate: new Date(dateReceived),
	notes: redactedNotes
});

/**
 * @param {string} statusValue
 */
const mapToCbosStatus = (statusValue) => {
	return representationsStatusesList.includes(statusValue.toUpperCase())
		? statusValue.toUpperCase()
		: 'UNKNOWN';
};
