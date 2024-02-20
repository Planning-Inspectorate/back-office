import { SynapseDB } from '../../common/synapse-db.js';
import { makePostRequest } from '../../common/back-office-api-client.js';
import { removeValues } from '../../common/utils.js';

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
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateRepresentations = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		try {
			logger.info(`reading Representations with caseReference ${caseReference}`);

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

			logger.info(
				`found ${count} Representations: ${JSON.stringify(
					representationEntities.map((u) => u.representationId)
				)}`
			);

			if (representationEntities.length > 0) {
				await makePostRequest(logger, '/migration/nsip-representation', representationEntities);
			}
		} catch (e) {
			logger.error(
				`Failed to migrate Representations for case ${caseReference}`,
				e?.response?.body,
				e
			);
			throw e;
		}
	}
};
