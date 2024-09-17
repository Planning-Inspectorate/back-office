import { SynapseDB } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';
import { valueToArray } from '../utils.js';

const query = `SELECT *
			   FROM [odw_curated_db].[dbo].[nsip_representation]
			   WHERE caseRef = ?`;

/**
 * Migrate nsip-respresentations for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const migrationRepresentationsForCase = async (log, caseReference) => {
	try {
		log.info(`reading Representations with caseReference ${caseReference}`);
		const { representationEntities, count } = await getRepresentationsForCase(log, caseReference);

		log.info(
			`found ${count} Representations: ${JSON.stringify(
				representationEntities.map((u) => u.representationId)
			)}`
		);
		if (representationEntities.length > 0) {
			await makePostRequest(log, '/migration/nsip-representation', representationEntities);
		}
	} catch (e) {
		throw new Error(`Failed to migrate Representations for case ${caseReference}`, { cause: e });
	}
};

/**
 * Get Representations for a case
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
d */
export const getRepresentationsForCase = async (log, caseReference) => {
	log.info`Getting Representations for case ${caseReference}`;
	const [representationRows, count] = await SynapseDB.query(query, {
		replacements: [caseReference]
	});

	const representationEntities = representationRows.map((row) => {
		return {
			...row,
			representationId: parseInt(row.representationId),
			caseId: parseInt(row.caseId),
			originalRepresentation: constructOriginalRepresentation(
				row.originalRepresentation,
				row.redactedRepresentation
			),
			attachmentIds: valueToArray(row.attachmentIds)
		};
	});

	return { representationEntities, count };
};

const constructOriginalRepresentation = (originalRepresentation, redactedRepresentation) => {
	if (originalRepresentation?.trim()) return originalRepresentation.trim();
	if (redactedRepresentation?.trim()) return redactedRepresentation.trim();
	return 'No data in original record';
};
