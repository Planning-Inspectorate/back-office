import { getCaseIdFromRef } from './utils.js';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { databaseConnector } from '#utils/database-connector.js';
import { omit } from 'lodash-es';

/**
 * @typedef {import('pins-data-model').Schemas.Representation} RepresentationModel
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

		// TODO attachments
		// for (const attachmentId in representationEntity.attachmentIds) {
		// 	// create RepresentationAttachment, Document
		// }
	}
};

/**
 * @typedef {import('apps/api/src/database/schema.d.ts').Representation} Representation
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
		status,
		originalRepresentation,
		redactedRepresentation,
		redacted,
		received: dateReceived,
		type: representationType,
		unpublishedUpdates: false,
		representativeId,
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
	actionDate: dateReceived,
	notes: redactedNotes
});
