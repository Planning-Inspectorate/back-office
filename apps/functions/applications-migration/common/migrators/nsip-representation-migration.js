import { SynapseDB } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';
import { removeValues } from '../utils.js';

const representationProperties = [
	'representationId',
	'referenceId',
	'examinationLibraryRef',
	'caseRef',
	'caseId',
	'status',
	'originalRepresentation',
	'redacted',
	'redactedRepresentation',
	'redactedBy',
	'redactedNotes',
	'representationFrom',
	'representedId',
	'representativeId',
	'representationType',
	'dateReceived'
];

const query = `SELECT ${representationProperties.join(', ')}
			   FROM [odw_curated_db].[dbo].[relevant_representation]
			   WHERE caseRef = ?`;

/**
 * Migrate nsip-respresentations
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateRepresentations = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		await migrationRepresentationsForCase(logger, caseReference);
	}
};

/**
 * Migrate nsip-respresentations for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export async function migrationRepresentationsForCase(log, caseReference) {
	try {
		log.info(`reading Representations with caseReference ${caseReference}`);

		const [representationRows, count] = await SynapseDB.query(query, {
			replacements: [caseReference]
		});

		const representationEntities = representationRows.map((row) => {
			removeValues(row, [null, '']);

			return {
				...row,
				originalRepresentation: row.originalRepresentation || ''
				// attachmentIds: row.attachmentIds?.split(',')
			};
		});

		log.info(
			`found ${count} Representations: ${JSON.stringify(
				representationEntities.map((u) => u.representationId)
			)}`
		);

		if (representationEntities.length > 0) {
			await makePostRequest(log, '/migration/nsip-representation', representationEntities);
		}
	} catch (e) {
		log.error(`Failed to migrate Representations for case ${caseReference}`, e?.response?.body, e);
		throw e;
	}
}
