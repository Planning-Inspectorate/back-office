import { SynapseDB } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';
import { pick } from 'lodash-es';
import { BO_GENERAL_S51_CASE_REF, ODW_GENERAL_S51_CASE_REF } from '@pins/applications';

const query = 'SELECT * FROM [odw_curated_db].[dbo].[nsip_s51_advice] WHERE caseReference = ?';

const s51AdviceProperties = [
	'adviceId',
	'adviceReference',
	'caseId',
	'caseReference',
	'title',
	'from',
	'agent',
	'method',
	'enquiryDate',
	'enquiryDetails',
	'adviceGivenBy',
	'adviceDate',
	'adviceDetails',
	'status',
	'redactionStatus',
	'attachmentIds'
];

/**
 * Migrate s51-advice
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateS51Advice = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		await migrateS51AdviceForCase(logger, caseReference);
	}
};

/**
 * Migrate s51-advice for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export async function migrateS51AdviceForCase(log, caseReference, synapseQuery = query) {
	try {
		log.info(`reading S51 Advice with caseReference ${caseReference}`);

		const { s51AdviceEntities, count } = await getNsipS51Advice(log, caseReference, synapseQuery);

		log.info(
			`found ${count} S51 Advice: ${JSON.stringify(s51AdviceEntities.map((u) => u.adviceId))}`
		);

		if (s51AdviceEntities.length > 0) {
			await makePostRequest(log, '/migration/s51-advice', s51AdviceEntities);
		}
	} catch (e) {
		log.error(`Failed to migrate S51 Advice for case ${caseReference}`, e?.response?.body, e);
		throw e;
	}
}

/**
 * Get S51 Advice for a case
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const getNsipS51Advice = async (log, caseReference, synapseQuery = query) => {
	log.info(`Getting S51 Advice for case ${caseReference}`);

	const [s51AdviceRows, count] = await SynapseDB.query(synapseQuery, {
		replacements: [caseReference]
	});

	const s51AdviceEntities = s51AdviceRows.map((row) => {
		if (caseReference === ODW_GENERAL_S51_CASE_REF) {
			row.adviceReference = row.adviceReference.replace(
				ODW_GENERAL_S51_CASE_REF,
				BO_GENERAL_S51_CASE_REF
			);
			row.caseReference = BO_GENERAL_S51_CASE_REF;
		}
		return {
			...pick(row, s51AdviceProperties),
			caseId: Number(row.caseId), // TODO: remove after ODW-1307 is completed
			status: mapStatus(row.status),
			attachmentIds: row.attachmentIds ? row.attachmentIds?.split(',') : []
		};
	});

	return { s51AdviceEntities, count };
};

/**
 *
 * @param {string} status
 * @returns {string|undefined}
 */
const mapStatus = (status) =>
	({
		checked: 'checked',
		unchecked: 'unchecked',
		'not checked': 'unchecked',
		'ready to publish': 'readytopublish',
		published: 'published',
		donotpublish: 'donotpublish',
		'do not publish': 'donotpublish',
		depublished: 'unchecked'
	}[status]);
